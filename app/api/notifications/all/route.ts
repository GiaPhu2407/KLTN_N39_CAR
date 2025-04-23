import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();

    const userId =
      typeof session.idUsers === "string"
        ? parseInt(session.idUsers, 10)
        : session.idUsers;

    await prisma.notification.deleteMany({
      where: { userId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xóa toàn bộ thông báo:", error);
    return NextResponse.json(
      { error: "Lỗi xóa toàn bộ thông báo" },
      { status: 500 }
    );
  }
}
