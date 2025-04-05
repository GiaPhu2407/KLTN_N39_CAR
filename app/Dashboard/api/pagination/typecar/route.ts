import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page: number = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit_size: number = searchParams.get("limit_size")
      ? Number(searchParams.get("limit_size"))
      : 10;
    const skip = (page - 1) * limit_size;
    const searchText = searchParams.get("search") || "";
    const whereClause = searchText
      ? {
          OR: [
            { TenLoai: { contains: searchText } },
            { NhanHieu: { contains: searchText } },
          ],
        }
      : {};
    const totalRecords = await prisma.loaiXe.count({ where: whereClause });
    const totalPage = Math.ceil(totalRecords / limit_size);
    const data = await prisma.loaiXe.findMany({
      where: whereClause,
      skip: skip,
      take: limit_size,
    });
    console.log("Backend response:", { data, totalRecords, totalPage });
    return NextResponse.json(
      {
        data,
        meta: { totalRecords, totalPage, page, limit_size, skip },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
  }
}
