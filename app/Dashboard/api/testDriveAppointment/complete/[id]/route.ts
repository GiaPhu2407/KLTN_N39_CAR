import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Update appointment status to COMPLETED
    const updatedLichHen = await prisma.lichHenTraiNghiem.update({
      where: { idLichHen: parseInt(id) },
      data: {
        trangThai: "COMPLETED", // Change status to COMPLETED
      },
      include: {
        xe: true,
      },
    });

    return NextResponse.json({
      data: updatedLichHen,
      message: "Cập nhật trạng thái đã trải nghiệm xe thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái:", error.message);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái lịch hẹn", details: error.message },
      { status: 500 }
    );
  }
}