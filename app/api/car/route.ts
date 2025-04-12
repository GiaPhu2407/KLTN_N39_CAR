import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET () {
  const xe = await prisma.xe.findMany({
    where: {
      TrangThai: "Còn hàng"
    }
  })
  return NextResponse.json(xe)
}