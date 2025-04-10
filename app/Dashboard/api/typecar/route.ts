// app/Dashboard/api/typecar/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { boolean } from "zod";

export async function GET(request: NextRequest) {
  const loaiXe = await prisma.loaiXe.findMany();
  return NextResponse.json(loaiXe);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existingLoaiXe = await prisma.loaiXe.findFirst({
      where: { TenLoai: body.TenLoai },
    });
    if (existingLoaiXe) {
      return NextResponse.json(
        { message: "Loại xe này đã tồn tại" },
        { status: 400 }
      );
    }

    const imageUrls = Array.isArray(body.HinhAnh)
      ? body.HinhAnh
      : [body.HinhAnh].filter(boolean);
    const newLoaiXe = await prisma.loaiXe.create({
      data: {
        TenLoai: body.TenLoai,
        NhanHieu: body.NhanHieu,
        HinhAnh: imageUrls.join("|"),
      },
    });
    console.log("Dữ liệu trước khi thêm", newLoaiXe);
    return NextResponse.json(
      { newLoaiXe, message: "Thêm loại xe thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi xử lý yêu cầu:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
