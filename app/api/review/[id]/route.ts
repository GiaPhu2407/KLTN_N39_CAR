
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDanhGia = parseInt(params.id);

    if (isNaN(idDanhGia)) {
      return NextResponse.json(
        { error: "ID đánh giá không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if the rating exists before attempting to delete
    const existingRating = await prisma.danhGiaTraiNghiem.findUnique({
      where: {
        idDanhGia: idDanhGia,
      },
    });

    if (!existingRating) {
      return NextResponse.json(
        { error: "Đánh giá không tồn tại" },
        { status: 404 }
      );
    }

    // Delete the rating from the database
    await prisma.danhGiaTraiNghiem.delete({
      where: {
        idDanhGia: idDanhGia,
      },
    });

    return NextResponse.json({
      message: "Đã xóa đánh giá thành công",
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa đánh giá" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idDanhGia = parseInt(params.id);

    if (isNaN(idDanhGia)) {
      return NextResponse.json(
        { error: "ID đánh giá không hợp lệ" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { SoSao, NoiDung } = data;

    // Validate input data
    if (SoSao === undefined || SoSao < 1 || SoSao > 5) {
      return NextResponse.json(
        { error: "Số sao phải từ 1 đến 5" },
        { status: 400 }
      );
    }

    // Update the rating in the database
    const updatedRating = await prisma.danhGiaTraiNghiem.update({
      where: {
        idDanhGia: idDanhGia,
      },
      data: {
        SoSao,
        NoiDung,
        NgayDanhGia: new Date(), // Optionally update the review date to current time
      },
    });

    return NextResponse.json({
      data: updatedRating,
      message: "Cập nhật đánh giá thành công",
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật đánh giá" },
      { status: 500 }
    );
  }
}

// File: app/api/danhgia/xe/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idXe = parseInt(params.id);

    if (isNaN(idXe)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const reviews = await prisma.danhGiaTraiNghiem.findMany({
      where: {
        idXe: idXe,
      },
      include: {
        user: {
          select: {
            Hoten: true,
            Avatar: true,
          },
        },
      },
      orderBy: {
        NgayDanhGia: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}