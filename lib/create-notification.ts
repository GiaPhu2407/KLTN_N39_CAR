import { NextResponse } from "next/server";

type NotificationParams = {
  userId: number;
  type: string;
  message: string;
};

export async function createNotification({
  userId,
  type,
  message,
}: NotificationParams) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    const url = new URL("/api/notifications", baseUrl).toString();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        type,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Lỗi tạo thông báo", error);
    return NextResponse.json({ message: "Lỗi tạo thông báo" }, { status: 400 });
  }
}
