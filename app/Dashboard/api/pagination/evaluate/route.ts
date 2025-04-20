import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit_size = searchParams.get("limit_size")
      ? Number(searchParams.get("limit_size"))
      : 10;
    const search = searchParams.get("search") || "";

    const session = await getSession();
    const skip = (page - 1) * limit_size;
    let whereCondition: any = {};
    if (session?.user?.id && session?.role?.TenNguoiDung !== "Admin") {
      whereCondition.idUser = Number(session.user.id);
    }

    if (search) {
      whereCondition.OR = [
        {
          lichHen: {
            TenKhachHang: {
              contains: search,
            },
          },
        },
        {
          lichHen: {
            Sdt: {
              contains: search,
            },
          },
        },
        {
          xe: {
            TenXe: {
              contains: search,
            },
          },
        },
        {
          NoiDung: {
            contains: search,
          },
        },
      ];
    }
    const totalRecords = await prisma.danhGiaTraiNghiem.count({
      where: whereCondition,
    });

    const totalPage = Math.ceil(totalRecords / limit_size);
    const data = await prisma.danhGiaTraiNghiem.findMany({
      where: whereCondition,
      skip: skip,
      take: limit_size,
      include: {
        lichHenTraiNghiem: {
          select: {
            TenKhachHang: true,
            Sdt: true,
            Email: true,
          },
        },
        xe: {
          select: {
            TenXe: true,
            GiaXe: true,
          },
        },
      },
      orderBy: {
        NgayDanhGia: "desc",
      },
    });
    return NextResponse.json(
      {
        data,
        meta: {
          page,
          limit_size,
          totalRecords,
          totalPage,
          skip,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi API phân trang", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
