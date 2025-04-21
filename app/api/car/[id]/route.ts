import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
      const xe = await prisma.xe.findUnique({
          where: {
              idXe: parseInt(params.id),
          },
          include: {
              loaiXe: true,
          },
      });

      if (!xe) {
          return NextResponse.json({ message: 'Không tìm thấy xe' }, { status: 404 });
      }
      // Convert the stored string back to an array
      const modifiedXe = {
          ...xe,
          HinhAnh: xe.HinhAnh ? xe.HinhAnh.split('|') : []
      };

      return NextResponse.json(modifiedXe);
  } catch (error) {
      return NextResponse.json({ message: 'Lỗi khi lấy thông tin xe' }, { status: 500 });
  }
}