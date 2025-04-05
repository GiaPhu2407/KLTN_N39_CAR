import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const loaiXe = await prisma.loaiXe.findMany();
    return NextResponse.json(loaiXe);
}
