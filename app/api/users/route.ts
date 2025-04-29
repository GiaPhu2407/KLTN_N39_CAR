import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request:NextRequest){
    try {
        const user = await prisma.users.findMany();
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({message:"Không tìm thấy tài khoản"});

    }
}
