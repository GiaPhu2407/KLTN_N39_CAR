import prisma from "@/prisma/client";
import { NextResponse } from "next/server";


export async function GET() {
    const nhaCungCap = await prisma.nhaCungCap.findMany();
    return NextResponse.json(nhaCungCap);
}