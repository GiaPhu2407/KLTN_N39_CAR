import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDanhGia = parseInt(params.id);
    const xe = await prisma.danhGiaTraiNghiem.delete({
      where: {
        idDanhGia: idDanhGia,
      },
    });

    return NextResponse.json(
      { xe, message: "Đánh giá đã được xóa" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Lổi khi xóa Đánh giá" },
      { status: 500 }
    );
  }
}
