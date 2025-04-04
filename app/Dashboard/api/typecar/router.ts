import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { boolean } from "zod";

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
    return NextResponse.json(
      { newLoaiXe, message: "Thêm loại xe thành công" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
