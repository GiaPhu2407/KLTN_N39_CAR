import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const {TenKhachHang, Sdt, Email, idLoaiXe, idXe, NgayHen, GioHen, DiaDiem, NoiDung, trangThai } = await req.json();

    const GioHenLayXe24h = convertTo24Hour(GioHen);
    const pickupDate = new Date(NgayHen);

    if (isNaN(pickupDate.getTime())) {
      throw new Error("Giá trị ngày không hợp lệ");
    }

    const [hours, minutes] = GioHenLayXe24h.split(':').map(Number);
    pickupDate.setHours(hours, minutes, 0, 0);

    // Lưu vào cơ sở dữ liệu
    const lichHenLay = await prisma.lichHenTraiNghiem.create({
      data: {
        idUser: session.idUsers,
        TenKhachHang: TenKhachHang?.trim() || '',
        Sdt: Sdt?.trim() || '',
        Email: Email?.trim() || '',
        idXe: parseInt(idXe),
        idLoaiXe: parseInt(idLoaiXe), 
        GioHen: pickupDate,  
        NgayHen: pickupDate.toISOString(),
        DiaDiem: DiaDiem?.trim() || '',
        NoiDung: NoiDung?.trim() || '',
        trangThai: 'PENDING'
      },
      include: {
        xe: true,
        loaiXe: true
      }
    });

    // Get all staff members with role ID 2 (assuming 2 is for staff)
  

    // Create notifications for all staff members

    // Đã loại bỏ phần gửi email

    return NextResponse.json(lichHenLay);
  } catch (error: any) {
    console.error('Pickup schedule creation error:', error.message);
    return NextResponse.json(
      { error: 'Không thể tạo lịch hẹn lấy xe', details: error.message },
      { status: 500 }
    );
  }
}

function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export async function GET() {
  try {
    const pickupSchedules = await prisma.lichHenTraiNghiem.findMany({
      include: {
        xe: true,
        loaiXe: true,
      }
    });
    
    return NextResponse.json(pickupSchedules);
  } catch (error) {
    console.error('Pickup schedules fetch error:', error);
    return NextResponse.json({ error: 'Không thể tải lịch hẹn lấy xe' }, { status: 500 });
  }
}