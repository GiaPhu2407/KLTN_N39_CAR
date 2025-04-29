import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";
import { createNotification } from "@/lib/create-notification";

// PUT Function with fixed user ID handling
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    console.log("Updating Schedule ID:", id);

    // Handle dates properly based on what's actually coming from the client
    let pickupDate;

    if (GioHen && typeof GioHen === "string" && GioHen.includes("T")) {
      pickupDate = new Date(GioHen);
    } else {
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

    // IMPORTANT: Log the customer ID for debugging
    console.log("Current appointment's user ID:", existingLichHen.idUser);

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
        // IMPORTANT: Make sure we're not changing the user ID during update
        // idUser: existingLichHen.idUser, // Uncomment this if idUser is getting changed
      },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    // Format date and time for notifications
    const formattedDate = new Date(NgayHen).toLocaleDateString("vi-VN");
    const formattedTime =
      typeof GioHen === "string" && !GioHen.includes("T")
        ? GioHen
        : pickupDate.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

    // Get all staff members (role ID 2)
    const staffMembers = await prisma.users.findMany({
      where: {
        idRole: 2,
      },
    });

    // Create notifications for staff members
    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "appointment_update",
          message: `Lịch hẹn được cập nhật: ${TenKhachHang} - ${
            updatedLichHen.xe?.TenXe || "Xe không xác định"
          } - ${formattedDate} ${formattedTime}`,
        })
      )
    );

    // CRITICAL FIX: Use the original customer ID from the existing appointment record
    // Don't do another database lookup which could cause issues
    if (existingLichHen.idUser) {
      console.log(
        `Creating customer notification for user ID: ${existingLichHen.idUser}`
      );

      // Direct notification to the user stored in the appointment record
      await createNotification({
        userId: existingLichHen.idUser, // Use the ID directly from the appointment record
        type: "appointment_update",
        message: `Lịch hẹn trải nghiệm xe ${
          updatedLichHen.xe?.TenXe || "không xác định"
        } của bạn đã được cập nhật vào ngày ${formattedDate} lúc ${formattedTime}`,
      });
    }

    return NextResponse.json(updatedLichHen);
  } catch (error: any) {
    console.error("Pickup schedule update error:", error.message);
    return NextResponse.json(
      { error: "Không thể cập nhật lịch hẹn lấy xe", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE Function with fixed user ID handling
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Fetch appointment details before deletion to use in notification
    const lichHen = await prisma.lichHenTraiNghiem.findUnique({
      where: { idLichHen: id },
      include: {
        xe: true,
        loaiXe: true,
      },
    });

    if (!lichHen) {
      return NextResponse.json(
        { error: "Không tìm thấy lịch hẹn" },
        { status: 404 }
      );
    }

    // IMPORTANT: Log the customer ID for debugging
    console.log("Appointment's user ID before deletion:", lichHen.idUser);

    // Format date and time for notifications
    const formattedDate = lichHen.NgayHen
      ? new Date(lichHen.NgayHen).toLocaleDateString("vi-VN")
      : "không xác định";

    const formattedTime = lichHen.GioHen
      ? new Date(lichHen.GioHen).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "không xác định";

    // CRITICAL FIX: Store customer ID before deleting the appointment
    // and make sure we're capturing the correct ID
    const customerId = lichHen.idUser;
    console.log(`Captured customer ID before deletion: ${customerId}`);

    // Delete the appointment
    const deletedLichHen = await prisma.lichHenTraiNghiem.delete({
      where: { idLichHen: id },
    });

    // Get all staff members (role ID 2)
    const staffMembers = await prisma.users.findMany({
      where: {
        idRole: 2,
      },
    });

    // Create deletion notifications for staff members
    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "appointment_delete",
          message: `Lịch hẹn đã bị hủy: ${lichHen.TenKhachHang} - ${
            lichHen.xe?.TenXe || "Xe không xác định"
          } - ${formattedDate} ${formattedTime}`,
        })
      )
    );

    // CRITICAL FIX: Use the original customer ID captured before deletion
    // Don't do another database lookup which could cause issues
    if (customerId) {
      console.log(
        `Creating deletion notification for customer ID: ${customerId}`
      );

      // Direct notification to the user ID captured before deletion
      await createNotification({
        userId: customerId, // Use the ID directly from the appointment record
        type: "appointment_delete",
        message: `Lịch hẹn trải nghiệm xe ${
          lichHen.xe?.TenXe || "không xác định"
        } của bạn vào ngày ${formattedDate} lúc ${formattedTime} đã bị hủy`,
      });
    }

    return NextResponse.json(
      { deletedLichHen, message: "Xóa lịch hẹn thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Pickup schedule deletion error:", error.message);
    return NextResponse.json(
      { error: "Không thể xóa lịch hẹn lấy xe", details: error.message },
      { status: 500 }
    );
  }
}
