import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { read } = body;
    const notification = await prisma.notification.update({
      where: { id: parseInt(params.id) },
      data: { read },
    });

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error("Lỗi cập nhật thông báo:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật thông báo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    const notificationId = parseInt(params.id, 10);

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== session.idUsers) {
      return NextResponse.json({ error: "Không cho phép" }, { status: 404 });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xóa thông báo");
    return NextResponse.json(
      { error: "Lỗi khi xóa thông báo" },
      { status: 500 }
    );
  }
}
