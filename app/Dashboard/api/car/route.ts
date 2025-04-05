import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  checkCarExists,
  validateCar,
} from "../../zodschema/zodCarManager/route";

export async function GET() {
  const xe = await prisma.xe.findMany();
  return NextResponse.json(xe);
}

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Original xe creation logic
//     // Check if xe already exists
//     const existingXe = await prisma.xe.findFirst({
//       where: {
//         TenXe: body.TenXe,
//       },
//     });
//     if (existingXe) {
//       return NextResponse.json(
//         { message: "Tên xe đã tồn tại" },
//         { status: 400 }
//       );
//     }

//     // Ensure HinhAnh is properly handled as an array
//     const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);

//     const newXe = await prisma.xe.create({
//       data: {
//         TenXe: body.TenXe,
//         idLoaiXe: parseInt(body.idLoaiXe),
//         GiaXe: parseFloat(body.GiaXe),
//         MauSac: body.MauSac,
//         DongCo: body.DongCo,
//         TrangThai: body.TrangThai,
//         HinhAnh: imageUrls.join('|'), // Use a separator that won't appear in URLs
//         NamSanXuat: body.NamSanXuat
//       },
//     });

//     return NextResponse.json({
//       newXe,
//       message: "Thêm xe thành công"
//     }, { status: 201 });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { message: "Lỗi khi xử lý yêu cầu" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validation = validateCar(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Dữ liệu không hợp lệ",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Check if car with same name already exists
    const exists = await checkCarExists(prisma, body.TenXe);
    if (exists) {
      return NextResponse.json(
        { message: "Tên xe đã tồn tại" },
        { status: 400 }
      );
    }

    // Ensure HinhAnh is properly handled as an array
    const imageUrls = Array.isArray(body.HinhAnh)
      ? body.HinhAnh
      : [body.HinhAnh].filter(Boolean);

    // Clean price value for storage
    const cleanedPrice = body.GiaXe.replace(/[^\d]/g, "");

    const newXe = await prisma.xe.create({
      data: {
        TenXe: body.TenXe,
        idLoaiXe: parseInt(body.idLoaiXe),
        GiaXe: parseFloat(cleanedPrice),
        MauSac: body.MauSac,
        DongCo: body.DongCo,
        TrangThai: body.TrangThai,
        HinhAnh: imageUrls.join("|"), // Use a separator that won't appear in URLs
        NamSanXuat: body.NamSanXuat,
        ThongSoKyThuat: body.ThongSoKyThuat,
        MoTa: body.MoTa,
        idNhaCungCap: parseInt(body.idNhaCungCap),
      },
    });

    return NextResponse.json(
      {
        newXe,
        message: "Thêm xe thành công",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
