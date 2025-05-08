import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalDeposits = await prisma.datCoc.count();

    const pendingDeposits = await prisma.datCoc.count({
      where: {
        TrangThaiDat: "Chờ xác nhận",
      },
    });

    const totalCustomers = await prisma.users.count({
      where: {
        role: {
          is: {
            TenNguoiDung: "KhachHang",
          },
        },
      },
    });

    const totalLichhen = await prisma.lichHenLayXe.count();

    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const monthlyData = await prisma.datCoc.groupBy({
      by: ["NgayDat"],
      _sum: {
        SotienDat: true,
      },
      where: {
        NgayDat: {
          gte: sixMonthsAgo,
        },
        TrangThaiDat: "Đã xác nhận",
      },
    });

    const recentDatCoc = await prisma.datCoc.findMany({
      take: 5,
      orderBy: { NgayDat: "desc" },
      include: {
        khachHang: {
          select: { Hoten: true },
        },
        LichHenLayXe: {
          select: { DiaDiem: true },
        },
      },
    });

    return NextResponse.json({
      totalDeposits,
      pendingDeposits,
      totalLichhen,
      totalCustomers,
      monthlyData,
      recentDatCoc,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
