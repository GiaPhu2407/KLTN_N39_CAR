import { sendEmail } from "@/app/emailService/route";
import {
  deleteAppointmentEmailTemplate,
  updateAppointmentEmailTemplate,
  createAppointmentEmailTemplate,
} from "@/app/emailTemplate/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/create-notification";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const appointment = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: parseInt(id) },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // Tạo thông báo xem chi tiết
    if (appointment.idUser) {
      await createNotification({
        userId: appointment.idUser,
        type: "appointment_view",
        message: `Bạn đã xem chi tiết lịch hẹn lái thử xe ${appointment.xe?.TenXe || "không xác định"}`,
      });
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin lịch hẹn", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const appointment = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: parseInt(id) },
      include: {
        xe: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // Lưu thông tin trước khi xóa
    const userId = appointment.idUser;
    const customerName = appointment.TenKhachHang || "Khách hàng";
    const carName = appointment.xe?.TenXe || "không xác định";
    const formattedDate = appointment.NgayHen
      ? new Date(appointment.NgayHen).toLocaleDateString("vi-VN")
      : "không xác định";

    // Xóa lịch hẹn
    await prisma.lichHenTraiNghiem.delete({
      where: { idLichHen: parseInt(id) },
    });

    // Tạo thông báo cho admin
    const Admin = await prisma.users.findMany({
      where: { idRole: 2 }, // Role Admin
    });

    await Promise.all(
      Admin.map((admin) =>
        createNotification({
          userId: admin.idUsers,
          type: "appointment_delete",
          message: `Lịch hẹn đã hủy: ${customerName} - ${carName} - ${formattedDate}`,
        })
      )
    );

    // Tạo thông báo cho khách hàng
    if (userId) {
      await createNotification({
        userId: userId,
        type: "appointment_delete",
        message: `Lịch hẹn lái thử xe ${carName} của bạn đã được hủy`,
      });

      // Tạo thông báo cho khách hàng khác
      const otherCustomers = await prisma.users.findMany({
        where: { idRole: 1, NOT: { idUsers: userId } }, // Role khách hàng
      });

      await Promise.all(
        otherCustomers.map((customer) =>
          createNotification({
            userId: customer.idUsers,
            type: "appointment_delete",
            message: `Lịch hẹn ${carName} của ${customerName} đã hủy`,
          })
        )
      );
    }

    // Gửi email xác nhận hủy
    if (appointment.Email) {
      const emailHtml = deleteAppointmentEmailTemplate({
        TenKhachHang: customerName,
        NgayHen: appointment.NgayHen || null,
        GioHen: appointment.GioHen
          ? new Date(appointment.GioHen).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        DiaDiem: appointment.DiaDiem || "",
        NoiDung: "Hủy lịch hẹn lái thử xe",
        xe: {
          TenXe: carName,
        },
      });

      await sendEmail(
        appointment.Email,
        "Xác nhận hủy lịch hẹn lái thử xe",
        emailHtml
      );
    }

    return NextResponse.json({ message: "Đã hủy lịch hẹn thành công" });
  } catch (error: any) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Không thể hủy lịch hẹn", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Lấy dữ liệu hiện tại
    const existingAppointment = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: parseInt(id) },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // Chuẩn bị dữ liệu cập nhật - giữ nguyên giá trị cũ nếu không có giá trị mới
    const updateData: any = {
      TenKhachHang: body.TenKhachHang ?? existingAppointment.TenKhachHang,
      Sdt: body.Sdt ?? existingAppointment.Sdt,
      Email: body.Email ?? existingAppointment.Email,
      DiaDiem: body.DiaDiem ?? existingAppointment.DiaDiem,
      NoiDung: body.NoiDung ?? existingAppointment.NoiDung,
      idXe:
        body.idXe !== undefined
          ? parseInt(body.idXe)
          : existingAppointment.idXe,
      idLoaiXe:
        body.idLoaiXe !== undefined
          ? parseInt(body.idLoaiXe)
          : existingAppointment.idLoaiXe,
    };

    // Xử lý ngày và giờ
    let newDate = existingAppointment.NgayHen
      ? new Date(existingAppointment.NgayHen)
      : new Date();
    let newTime = existingAppointment.GioHen
      ? new Date(existingAppointment.GioHen)
      : new Date();

    if (body.NgayHen) {
      const parsedDate = new Date(body.NgayHen);
      if (!isNaN(parsedDate.getTime())) {
        newDate = parsedDate;
      }
    }

    if (body.GioHen) {
      try {
        const timeStr = body.GioHen.toString();
        if (timeStr.includes(":")) {
          const [hours, minutes] = timeStr.split(":").map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            newTime.setHours(hours, minutes, 0, 0);
          }
        } else {
          const hours = parseInt(timeStr);
          if (!isNaN(hours)) {
            newTime.setHours(hours, 0, 0, 0);
          }
        }
      } catch (error) {
        console.error("Error processing time:", error);
      }
    }

    // Kết hợp ngày và giờ
    const combinedDateTime = new Date(newDate);
    combinedDateTime.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);

    updateData.NgayHen = combinedDateTime;
    updateData.GioHen = combinedDateTime;

    // Thực hiện cập nhật
    const updatedAppointment = await prisma.lichHenTraiNghiem.update({
      where: { idLichHen: parseInt(id) },
      data: updateData,
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    // Thông tin cho thông báo
    const userId = updatedAppointment.idUser;
    const customerName = updatedAppointment.TenKhachHang || "Khách hàng";
    const carName = updatedAppointment.xe?.TenXe || "không xác định";
    const formattedDate = updatedAppointment.NgayHen
      ? new Date(updatedAppointment.NgayHen).toLocaleDateString("vi-VN")
      : "không xác định";
    const formattedTime = updatedAppointment.GioHen
      ? new Date(updatedAppointment.GioHen).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "không xác định";

    // Thông báo cho nhân viên
    const staffMembers = await prisma.users.findMany({
      where: { idRole: 2 },
    });

    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "appointment_update",
          message: `Lịch hẹn cập nhật: ${customerName} - ${carName} - ${formattedDate} ${formattedTime}`,
        })
      )
    );

    // Thông báo cho khách hàng
    if (userId) {
      await createNotification({
        userId: userId,
        type: "appointment_update",
        message: `Lịch hẹn ${carName} của bạn đã cập nhật: ${formattedDate} ${formattedTime}`,
      });

      // Thông báo cho khách hàng khác
      const otherCustomers = await prisma.users.findMany({
        where: { idRole: 1, NOT: { idUsers: userId } },
      });

      await Promise.all(
        otherCustomers.map((customer) =>
          createNotification({
            userId: customer.idUsers,
            type: "appointment_update",
            message: `Lịch hẹn ${carName} của ${customerName} đã cập nhật`,
          })
        )
      );
    }

    // Gửi email xác nhận
    if (updatedAppointment.Email) {
      const emailHtml = updateAppointmentEmailTemplate({
        TenKhachHang: customerName,
        NgayHen: updatedAppointment.NgayHen || null,
        GioHen: formattedTime,
        DiaDiem: updatedAppointment.DiaDiem || "",
        NoiDung: updatedAppointment.NoiDung || "Cập nhật lịch hẹn",
        xe: {
          TenXe: carName,
        },
      });

      await sendEmail(
        updatedAppointment.Email,
        "Xác nhận cập nhật lịch hẹn",
        emailHtml
      );
    }

    return NextResponse.json({
      appointment: updatedAppointment,
      message: "Cập nhật lịch hẹn thành công",
    });
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      {
        error: "Không thể cập nhật lịch hẹn",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
