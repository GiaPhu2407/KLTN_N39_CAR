
// app/api/evaluate/visibility/[id]/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { AnHien } = body;

    if (typeof AnHien !== "boolean") {
      return NextResponse.json(
        { message: "Trạng thái hiển thị không hợp lệ" },
        { status: 400 }
      );
    }

    // Find the review first to ensure it exists
    const existingReview = await prisma.danhGiaTraiNghiem.findUnique({
      where: { idDanhGia: id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá" },
        { status: 404 }
      );
    }

    // Update the visibility status
    const updatedReview = await prisma.danhGiaTraiNghiem.update({
      where: { idDanhGia: id },
      data: { AnHien },
    });

    return NextResponse.json(
      { 
        message: AnHien 
          ? "Đã ẩn đánh giá thành công" 
          : "Đã hiện đánh giá thành công", 
        data: updatedReview 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review visibility:", error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật trạng thái đánh giá" },
      { status: 500 }
    );
  }
}