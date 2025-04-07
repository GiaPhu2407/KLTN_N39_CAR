import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idXe = parseInt(params.id);
    const xe = await prisma.loaiXe.delete({ where: { idLoaiXe: idXe } });
    return NextResponse.json(
      {
        xe,
        message: `Xóa xe có mã ${params.id} thành công`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi khi xóa loại xe" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const idLoaiXe = parseInt(params.id);
    const imageUrls = Array.isArray(body.HinhAnh)
      ? body.HinhAnh
      : [body.HinhAnh].filter(Boolean);
    console.log("Image URLs to be saved:", imageUrls);

    const updateXe = await prisma.loaiXe.update({
      where: {
        idLoaiXe: idLoaiXe,
      },
      data: {
        TenLoai: body.TenLoai,
        NhanHieu: body.NhanHieu,
        HinhAnh: imageUrls.join("|"),
      },
    });

    return NextResponse.json(
      { updateXe, message: `Cập nhật loại xe từ id ${params.id} thành công` },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật loại xe" },
      { status: 500 }
    );
  }
}
