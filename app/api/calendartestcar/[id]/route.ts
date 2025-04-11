import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
        NoiDung 
      } = await req.json();
  
      // Debug log
      console.log('Updating Schedule ID:', id);
      console.log('NgayHen:', NgayHen);
      console.log('GioHen:', GioHen);
  
      // Handle dates properly based on what's actually coming from the client
      let pickupDate;
      
      // If GioHen is an ISO string (which appears to be the case)
      if (GioHen && typeof GioHen === 'string' && GioHen.includes('T')) {
        // Use GioHen as the primary date/time since it contains both date and time
        pickupDate = new Date(GioHen);
      } else {
        // Fallback to using NgayHen and parse the time portion
        pickupDate = new Date(NgayHen);
        
        if (GioHen && GioHen.includes(':')) {
          const [hours, minutes] = GioHen.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            pickupDate.setHours(hours, minutes, 0, 0);
          }
        }
      }
      
      if (isNaN(pickupDate.getTime())) {
        throw new Error("Invalid date/time values provided");
      }
      
      console.log('Combined DateTime:', pickupDate.toISOString());
  
      // Check if appointment exists
      const existingLichHen = await prisma.lichHenTraiNghiem.findUnique({
        where: { idLichHen: parseInt(id) }
      });
  
      if (!existingLichHen) {
        return NextResponse.json(
          { error: 'Không tìm thấy lịch hẹn' },
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
          trangThai: 'PENDING',
        },
      });
  
      return NextResponse.json(updatedLichHen);
    } catch (error: any) {
      console.error('Pickup schedule update error:', error.message);
      return NextResponse.json(
        { error: 'Không thể cập nhật lịch hẹn lấy xe', details: error.message },
        { status: 500 }
      );
    }
}

export async function DELETE(req: NextRequest, {params}: {params: {id:string} }) {
    try {
      const id = parseInt(params.id);
      const deletedLichHen = await prisma.lichHenTraiNghiem.delete({ where: { idLichHen: id } });
      return NextResponse.json({deletedLichHen, message: "Xóa lịch hẹn thành công"}, {status: 200});
    } catch (error: any) {
      return NextResponse.json(error.message);
    }
}