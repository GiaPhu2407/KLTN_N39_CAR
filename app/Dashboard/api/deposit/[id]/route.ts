import prisma from '@/prisma/client'
import type { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { createDatCocAppointmentEmailTemplate, deleteManyDatCocAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import { sendEmail } from '@/app/emailService/route';
import { createNotification } from "@/lib/create-notification";

export async function GET(req: NextApiRequest, {params}:{params: {id:string}}) {
    try {
        const id = parseInt(params.id)
      const datCoc = await prisma.datCoc.findUnique({
        where: { 
          idDatCoc: id
        },
        include: {
          xe: true,
          khachHang: true,
          LichHenLayXe: true,
        }
      })


      if (!datCoc) {
        return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' })
      }

      return NextResponse.json({datCoc, message: "đặt cọc thành công"})
    } catch (error) {
      console.error('Deposit details error:', error)
      return NextResponse.json({ error: 'Không thể lấy thông tin đặt cọc' })
    }
}

export async function DELETE(req: NextApiRequest, {params}:{params: {id:string}}) {
  try {
    const id = parseInt(params.id)
    const datCoc = await prisma.datCoc.findUnique({
      where: { idDatCoc: id },
      include: { 
        xe: true, 
        khachHang: true, 
        LichHenLayXe: true 
      }
    });

    if (!datCoc || !datCoc.khachHang) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' }, { status: 404 })
    }

    // Lưu trữ ID người dùng trước khi xóa để sử dụng sau này
    const customerId = datCoc.khachHang.idUsers;
    console.log(`Captured customer ID before deletion: ${customerId}`);

    // Delete associated pickup and delivery schedules
    await prisma.lichHenLayXe.deleteMany({ where: { idDatCoc: id } })

    // Set idDatCoc to null for the specific ChiTietDatCoc record
    await prisma.chiTietDatCoc.updateMany({ 
      where: { idDatCoc: id }, 
      data: { idDatCoc: null } 
    })

    // Delete the deposit
    await prisma.datCoc.deleteMany({ where: { idDatCoc: id } })

    // Update vehicle status
    if(datCoc?.idXe) {
      await prisma.xe.update({ 
        where: { idXe: datCoc.idXe}, 
        data: { TrangThai: 'Còn Hàng' } 
      })
    }

    // Format date and time for notifications
    const formattedDate = datCoc.NgayDat 
      ? new Date(datCoc.NgayDat).toLocaleDateString('vi-VN')
      : 'không xác định';
    
    const formattedPickupDate = datCoc.LichHenLayXe[0]?.NgayLayXe
      ? new Date(datCoc.LichHenLayXe[0].NgayLayXe).toLocaleDateString('vi-VN')
      : 'không xác định';
    
    const formattedPickupTime = datCoc.LichHenLayXe[0]?.GioHenLayXe || 'không xác định';

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
          type: "deposit_delete",
          message: `Đơn đặt cọc đã bị hủy: ${datCoc.khachHang?.Hoten} - ${
            datCoc.xe?.TenXe || "Xe không xác định"
          } - ${formattedDate} - ${datCoc.SotienDat?.toNumber().toLocaleString('vi-VN')} VNĐ`,
        })
      )
    );

    // Tạo thông báo cho khách hàng nếu có ID người dùng
    if (customerId) {
      console.log(`Creating deletion notification for customer ID: ${customerId}`);
      
      // Kiểm tra vai trò của người dùng
      const customer = await prisma.users.findUnique({
        where: { idUsers: customerId }
      });
      
      // Tạo thông báo cho khách hàng
      await createNotification({
        userId: customerId,
        type: "deposit_delete",
        message: `Đơn đặt cọc xe ${
          datCoc.xe?.TenXe || "không xác định"
        } của bạn đã bị hủy. Số tiền đặt cọc: ${datCoc.SotienDat?.toNumber().toLocaleString('vi-VN')} VNĐ`,
      });
      
      // Lấy tất cả người dùng có role ID 1 (khách hàng)
      const allCustomers = await prisma.users.findMany({
        where: { idRole: 1 }
      });
      
      // Tạo thông báo cho tất cả người dùng có role ID 1
      for (const user of allCustomers) {
        // Bỏ qua nếu đã tạo thông báo cho người dùng này
        if (user.idUsers === customerId) continue;
        
        await createNotification({
          userId: user.idUsers,
          type: "deposit_delete",
          message: `Đơn đặt cọc xe ${
            datCoc.xe?.TenXe || "không xác định"
          } của khách hàng ${datCoc.khachHang.Hoten} đã bị hủy. Số tiền đặt cọc: ${datCoc.SotienDat?.toNumber().toLocaleString('vi-VN')} VNĐ`,
        });
      }
    }

    // Prepare email data
    const emailTemplate = deleteManyDatCocAppointmentEmailTemplate({
      TenKhachHang: datCoc.khachHang.Hoten || 'Khách hàng',
      NgayLayXe: datCoc.LichHenLayXe[0]?.NgayLayXe?.toISOString() || null,
      GioHenLayXe: datCoc.LichHenLayXe[0]?.GioHenLayXe || '',
      DiaDiem: datCoc.LichHenLayXe[0]?.DiaDiem || '',
      NoiDung: 'Hủy đơn đặt cọc',
      Email: datCoc.khachHang.Email || '',
      Sdt: datCoc.khachHang.Sdt || '',
      SotienDat: datCoc.SotienDat?.toNumber() || 0,
      NgayDat: datCoc.NgayDat?.toISOString() || null,
      xe: {
        TenXe: datCoc.xe?.TenXe || null
      }
    });

    // Send cancellation email
    if (datCoc.khachHang.Email) {
      await sendEmail(
        datCoc.khachHang.Email, 
        'Thông báo hủy đơn đặt cọc', 
        emailTemplate
      );
    }

    return NextResponse.json({ message: 'Hủy đơn đặt cọc thành công' })
  } catch (error) {
    console.error('Cancel deposit error:', error)
    return NextResponse.json({ error: 'Không thể hủy đơn đặt cọc' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    
    const datCoc = await prisma.datCoc.findUnique({
      where: { idDatCoc: id },
      include: {
        xe: true,
        khachHang: true,
        LichHenLayXe: true
      }
    });

    if (!datCoc || !datCoc.khachHang) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' }, { status: 404 })
    }

    // Lưu trữ ID người dùng trước khi cập nhật
    const customerId = datCoc.khachHang.idUsers;
    console.log(`Customer ID for update notification: ${customerId}`);

    const updatedDatCoc = await prisma.datCoc.update({
      where: { 
        idDatCoc: id 
      },
      data: {
        TrangThaiDat: body.TrangThaiDat,
      }
    })
   
    // Format date and time for notifications
    const formattedDate = datCoc.NgayDat 
      ? new Date(datCoc.NgayDat).toLocaleDateString('vi-VN')
      : 'không xác định';
    
    const formattedPickupDate = datCoc.LichHenLayXe[0]?.NgayLayXe
      ? new Date(datCoc.LichHenLayXe[0].NgayLayXe).toLocaleDateString('vi-VN')
      : 'không xác định';
    
    const formattedPickupTime = datCoc.LichHenLayXe[0]?.GioHenLayXe || 'không xác định';

    // Get all staff members (role ID 2)
    const staffMembers = await prisma.users.findMany({
      where: {
        idRole: 2,
      },
    });

    // Create update notifications for staff members
    await Promise.all(
      staffMembers.map((staff) =>
        createNotification({
          userId: staff.idUsers,
          type: "deposit_update",
          message: `Đơn đặt cọc đã được cập nhật: ${datCoc.khachHang?.Hoten} - ${
            datCoc.xe?.TenXe || "Xe không xác định"
          } - Trạng thái mới: ${body.TrangThaiDat}`,
        })
      )
    );

    // Tạo thông báo cho khách hàng nếu có ID người dùng
    if (customerId) {
      console.log(`Creating update notification for customer ID: ${customerId}`);
      
      // Kiểm tra vai trò của người dùng
      const customer = await prisma.users.findUnique({
        where: { idUsers: customerId }
      });
      
      // Tạo thông báo cho khách hàng
      await createNotification({
        userId: customerId,
        type: "deposit_update",
        message: `Đơn đặt cọc xe ${
          datCoc.xe?.TenXe || "không xác định"
        } của bạn đã được cập nhật. Trạng thái mới: ${body.TrangThaiDat}`,
      });
      
      // Lấy tất cả người dùng có role ID 1 (khách hàng)
      const allCustomers = await prisma.users.findMany({
        where: { idRole: 1 }
      });
      
      // Tạo thông báo cho tất cả người dùng có role ID 1
      for (const user of allCustomers) {
        // Bỏ qua nếu đã tạo thông báo cho người dùng này
        if (user.idUsers === customerId) continue;
        
        await createNotification({
          userId: user.idUsers,
          type: "deposit_update",
          message: `Đơn đặt cọc xe ${
            datCoc.xe?.TenXe || "không xác định"
          } của khách hàng ${datCoc.khachHang.Hoten} đã được cập nhật. Trạng thái mới: ${body.TrangThaiDat}`,
        });
      }
    }

    // Prepare email data
    const emailTemplate = createDatCocAppointmentEmailTemplate({
      TenKhachHang: datCoc.khachHang.Hoten || 'Khách hàng',
      NgayLayXe: datCoc.LichHenLayXe[0]?.NgayLayXe?.toISOString() || null,
      GioHenLayXe: datCoc.LichHenLayXe[0]?.GioHenLayXe || '',
      DiaDiem: datCoc.LichHenLayXe[0]?.DiaDiem || '',
      NoiDung: `Cập nhật trạng thái: ${body.TrangThaiDat}`,
      Email: datCoc.khachHang.Email || '',
      Sdt: datCoc.khachHang.Sdt || '',
      SotienDat: datCoc.SotienDat?.toNumber() || 0,
      NgayDat: datCoc.NgayDat?.toISOString() || null,
      xe: {
        TenXe: datCoc.xe?.TenXe || null
      }
    });

    // Send update email
    if (datCoc.khachHang.Email) {
      await sendEmail(
        datCoc.khachHang.Email, 
        'Cập nhật trạng thái đơn đặt cọc', 
        emailTemplate
      );
    }

    return NextResponse.json({ 
      datCoc: updatedDatCoc, 
      message: 'Cập nhật trạng thái đơn đặt cọc thành công' 
    })
  } catch (error: any) {
    console.error('Update deposit error:', error)
    return NextResponse.json({error: error.message}, { status: 500 })
  }
}