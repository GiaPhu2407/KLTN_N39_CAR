import prisma from "@/prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}){
    try {
        const idUser = parseInt(params.id);
        const deleteUser = await prisma.users.delete({
            where: {
                idUsers: idUser
            }
        });
        return NextResponse.json({deleteUser, message: "Delete user successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({message: "Xóa Không Thành Công"}, {status: 500});
    }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    // Prepare update data
    const updateData: any = {
      Tentaikhoan: data.Tentaikhoan,
      Email: data.Email,
      Hoten: data.Hoten,
      Sdt: data.Sdt,
      Diachi: data.Diachi,
    };

    // Add idRole to updateData if it exists in the request
    if (data.idRole) {
      updateData.idRole = parseInt(data.idRole);
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { 
        idUsers: id 
      },
      data: updateData,
    });

    return NextResponse.json({updatedUser, message:"Cập nhật thành công"});
  } catch (error: any) {
    console.error('Update error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    const user = await prisma.users.findUnique({
      where: {
        idUsers: id
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}