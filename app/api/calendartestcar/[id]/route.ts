import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";
import { createNotification } from "@/lib/create-notification";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user session
    const session = await getSession();

    // Access id properly through params
    const id = params.id;

    const {
      TenKhachHang,
      Sdt,
      Email,
      idLoaiXe,
      idXe,
      NgayHen,
      GioHen,
      DiaDiem,
      NoiDung,
    } = await req.json();

    // Debug log
    console.log("Updating Schedule ID:", id);
    console.log("NgayHen:", NgayHen);
    console.log("GioHen:", GioHen);

    // Handle dates properly based on what's actually coming from the client
    let pickupDate;

    // If GioHen is an ISO string (which appears to be the case)
    if (GioHen && typeof GioHen === "string" && GioHen.includes("T")) {
      // Use GioHen as the primary date/time since it contains both date and time
      pickupDate = new Date(GioHen);
    } else {
      // Fallback to using NgayHen and parse the time portion
      pickupDate = new Date(NgayHen);

      if (GioHen && GioHen.includes(":")) {
        const [hours, minutes] = GioHen.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          pickupDate.setHours(hours, minutes, 0, 0);
        }
      }
    }

    if (isNaN(pickupDate.getTime())) {
      throw new Error("Invalid date/time values provided");
    }

    console.log("Combined DateTime:", pickupDate.toISOString());

    // Check if appointment exists
    const existingLichHen = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: parseInt(id) },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    if (!existingLichHen) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // Update database
    const updatedLichHen = await prisma.lichHenTraiNghiem.update({
      where: { idLichHen: parseInt(id) },
      data: {
        TenKhachHang: TenKhachHang.trim(),
        Sdt: Sdt.trim(),
        Email: Email.trim(),
        idXe: parseInt(idXe),
        idLoaiXe: parseInt(idLoaiXe),
        GioHen: pickupDate,
        NgayHen: pickupDate.toISOString(),
        DiaDiem: DiaDiem.trim(),
        NoiDung: NoiDung.trim(),
        trangThai: "PENDING",
      },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    // Format date and time for notifications
    const formattedDate = pickupDate.toLocaleDateString("vi-VN");
    const formattedTime = pickupDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Get all staff members with role ID 2
    const staffMembers = await prisma.users.findMany({
      where: {
        idRole: 2, // Role ID for staff
      },
    });

    // Create notifications for all staff members
    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "appointment_update",
          message: `Lịch hẹn đã cập nhật: ${TenKhachHang} - ${
            updatedLichHen.xe?.TenXe || "Xe không xác định"
          } - ${formattedDate} ${formattedTime}`,
        })
      )
    );

    // Create a notification for the user who owns the appointment
    await createNotification({
      userId: existingLichHen.idUser || session.idUsers,
      type: "appointment_update",
      message: `Lịch hẹn trải nghiệm xe ${
        updatedLichHen.xe?.TenXe || "không xác định"
      } của bạn đã được cập nhật thành công vào ngày ${formattedDate} lúc ${formattedTime}`,
    });

    return NextResponse.json(updatedLichHen);
  } catch (error: any) {
    console.error("Pickup schedule update error:", error.message);
    return NextResponse.json(
      { error: "Không thể cập nhật lịch hẹn lấy xe", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user session
    const session = await getSession();

    const id = parseInt(params.id);

    // First, fetch the appointment details before deleting it
    const appointmentToDelete = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: id },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    if (!appointmentToDelete) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // Store details for notification
    const tenKhachHang = appointmentToDelete.TenKhachHang;
    const tenXe = appointmentToDelete.xe?.TenXe || "không xác định";
    const ngayHen = new Date(appointmentToDelete.NgayHen);
    const formattedDate = ngayHen.toLocaleDateString("vi-VN");
    const formattedTime = ngayHen.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userId = appointmentToDelete.idUser;

    // Delete the appointment
    const deletedLichHen = await prisma.lichHenTraiNghiem.delete({
      where: { idLichHen: id },
    });

    // Get all staff members with role ID 2
    const staffMembers = await prisma.users.findMany({
      where: {
        idRole: 2, // Role ID for staff
      },
    });

    // Create notifications for all staff members
    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "appointment_delete",
          message: `Lịch hẹn đã bị hủy: ${tenKhachHang} - ${tenXe} - ${formattedDate} ${formattedTime}`,
        })
      )
    );

    // Create a notification for the user who owned the appointment
    if (userId) {
      await createNotification({
        userId: userId,
        type: "appointment_delete",
        message: `Lịch hẹn trải nghiệm xe ${tenXe} của bạn vào ngày ${formattedDate} lúc ${formattedTime} đã bị hủy`,
      });
    }

    return NextResponse.json(
      { deletedLichHen, message: "Xóa lịch hẹn thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Pickup schedule deletion error:", error.message);
    return NextResponse.json(
      { error: "Không thể xóa lịch hẹn", details: error.message },
      { status: 500 }
    );
  }
}
