import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit_size = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
    const userId = searchParams.get('userId') ? Number(searchParams.get('userId')) : undefined;
    
    // Search parameter
    const searchText = searchParams.get('search') || '';
    
    // Get session to check user role
    const session = await getSession();
    const skip = (page - 1) * limit_size;

    // Base where clause
    let whereClause: any = {};
    
    // Add user filter if userId is provided
    if (userId !== undefined) {
      whereClause.idKhachHang = userId;
    }

    // Build search conditions if searchText is provided
    if (searchText) {
      whereClause.OR = [
        // Customer (khachHang) related searches
        { khachHang: { Hoten: { contains: searchText } } },
        { khachHang: { Sdt: { contains: searchText } } },
        { khachHang: { Email: { contains: searchText } } },
        
        // Car (xe) related searches
        { xe: { TenXe: { contains: searchText } } },
        
        // Deposit status
        { TrangThaiDat: { contains: searchText } },
        
        // Appointment location
        { LichHenLayXe: { some: { DiaDiem: { contains: searchText } } } }
      ];
      
      // Handle numeric fields - try parsing as number
      const numericValue = parseFloat(searchText);
      if (!isNaN(numericValue)) {
        // For price (GiaXe) and deposit amount (SoTienDat)
        whereClause.OR.push(
          { SotienDat: { equals: numericValue } },
          { xe: { GiaXe: { equals: numericValue } } }
        );
      }
      
      // Handle date fields - try parsing as date
      try {
        // Check if searchText can be interpreted as a date
        const dateValue = new Date(searchText);
        if (!isNaN(dateValue.getTime())) {
          const startOfDay = new Date(dateValue);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(dateValue);
          endOfDay.setHours(23, 59, 59, 999);
          
          // For deposit date (NgayDat)
          whereClause.OR.push({
            NgayDat: {
              gte: startOfDay,
              lte: endOfDay
            }
          });
          
          // For car pickup appointment date (NgayLayXe)
          whereClause.OR.push({
            LichHenLayXe: {
              some: {
                NgayLayXe: {
                  gte: startOfDay,
                  lte: endOfDay
                }
              }
            }
          });
        }
      } catch (e) {
        // Not a valid date, ignore
      }
    }

    // Get total count with filters applied
    const totalRecords = await prisma.datCoc.count({
      where: whereClause
    });

    const totalPage = Math.ceil(totalRecords / limit_size);

    // Get paginated data with filters and include related details
    const data = await prisma.datCoc.findMany({
      where: whereClause,
      skip: skip,
      take: limit_size,
      include: {
        khachHang: {
          select: {
            Hoten: true,
            Sdt: true,
            Email: true,
          }
        },
        xe: {
          select: {
            TenXe: true,
            GiaXe: true,
            MauSac: true,
            loaiXe: {
              select: {
                TenLoai: true,
                NhanHieu: true
              }
            }
          }
        },
        LichHenLayXe: {
          select: {
            NgayLayXe: true,
            GioHenLayXe: true,
            DiaDiem: true,
          }
        },
        ThanhToan: {
          select: {
            PhuongThuc: true,
            NgayThanhToan: true,
            TrangThai: true
          }
        }
      },
      orderBy: {
        idDatCoc: 'desc'
      }
    });

    return NextResponse.json({
      data,
      meta: {
        totalRecords,
        totalPage,
        page,
        limit_size,
        skip          
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Search DatCoc error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}