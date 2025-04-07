import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nhaCungCapSchema from "../../zodschema/zodSupplies/route";


export async function GET() {
    const nhaCungCap = await prisma.nhaCungCap.findMany();
    return NextResponse.json(nhaCungCap);
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Check if request is for creating a new supplier
      const searchParams = request.nextUrl.searchParams;
      
      // Removed the Excel export functionality
      
      // Validate input data
      const checkNhaCungCap = nhaCungCapSchema.safeParse({
        TenNhaCungCap: body.TenNhaCungCap,
        Sdt: body.Sdt,
        Email: body.Email,
      });
  
      if (!checkNhaCungCap.success) {
        return NextResponse.json({
          message: "Dữ liệu không hợp lệ",
          errors: checkNhaCungCap.error.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message,
          }))
        }, { status: 400 });
      }
  
      // Check if supplier already exists
      const existingNhaCungCap = await prisma.nhaCungCap.findFirst({
        where: {
          OR: [
            { TenNhaCungCap: body.TenNhaCungCap },
            { Email: body.Email },
            { Sdt: body.Sdt }
          ]
        },
      });
  
      if (existingNhaCungCap) {
        return NextResponse.json(
          { message: "Nhà cung cấp đã tồn tại (tên, email hoặc số điện thoại trùng lặp)" },
          { status: 400 }
        );
      }
  
      // Create new supplier
      const newNhaCungCap = await prisma.nhaCungCap.create({
        data: {
          TenNhaCungCap: body.TenNhaCungCap,
          Sdt: body.Sdt,
          Email: body.Email
        },
      });
  
      return NextResponse.json({
        data: newNhaCungCap,
        message: "Thêm nhà cung cấp thành công"
      }, { status: 201 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Lỗi khi xử lý yêu cầu: " + (error as Error).message },
        { status: 500 }
      );
    }
  }