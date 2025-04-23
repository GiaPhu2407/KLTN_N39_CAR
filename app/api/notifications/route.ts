import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, message } = body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        read: false,
      },
    });

    // Trigger Pusher event
    await pusherServer.trigger(
      `user-${userId}`,
      "new-notification",
      notification
    );

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Lỗi tạo thông báo:", error);
    return NextResponse.json({ error: "Lỗi tạo thông báo" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Lỗi khi tải thông báo:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải thông báo" },
      { status: 500 }
    );
  }
}
