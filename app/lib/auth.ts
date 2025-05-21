import prisma from "@/prisma/client";
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Resend } from "resend";

const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export const runtime = "nodejs";

export async function signUp(
  email: string,
  username: string,
  password: string,
  fullname?: string,
  phone?: string,
  address?: string,
  roleId?: number
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ Email: email }, { Tentaikhoan: username }],
      },
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    // Validate fullname
    if (!fullname || fullname.trim() === "") {
      throw new Error("Full name is required");
    }

    // Validate address length
    if (address && address.length > 255) {
      throw new Error("Address is too long");
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Determine role based on username
    const isAdmin = username.toLowerCase().endsWith("admin");

    // Ensure roles exist
    await prisma.role.upsert({
      where: { idRole: 1 },
      update: { TenNguoiDung: "KhachHang" },
      create: {
        idRole: 1,
        TenNguoiDung: "KhachHang",
      },
    });

    await prisma.role.upsert({
      where: { idRole: 2 },
      update: { TenNguoiDung: "Admin" },
      create: {
        idRole: 2,
        TenNguoiDung: "Admin",
      },
    });

    // Create the user with the appropriate role
    const user = await prisma.users.create({
      data: {
        Email: email,
        Tentaikhoan: username,
        Matkhau: hashedPassword,
        Hoten: fullname.trim(),
        Sdt: phone || "",
        Diachi: address || "",
        idRole: isAdmin ? 2 : 1, // 1 for Admin, 2 for KhachHang
        Ngaydangky: new Date(),
      },
      select: {
        idUsers: true,
        Email: true,
        Tentaikhoan: true,
        Hoten: true,
        Sdt: true,
        Diachi: true,
        idRole: true,
        role: {
          select: {
            TenNguoiDung: true,
          },
        },
      },
    });

    return user;
  } catch (error: any) {
    console.error("Signup error:", error);
    //  Giá trị vượt quá độ dài cho phép:
    if (error.code === "P2000") {
      throw new Error("One or more fields exceed maximum length");
    }
    // Vi phạm ràng buộc duy nhất (unique constraint)
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("Email")) {
        throw new Error("Email already in use");
      }
      if (error.meta?.target?.includes("Tentaikhoan")) {
        throw new Error("Username already in use");
      }
      throw new Error("Registration failed: Duplicate value");
    }
    // Vi phạm ràng buộc khóa ngoại (foreign key constraint):
    if (error.code === "P2003") {
      throw new Error("Invalid role assignment");
    }

    throw error;
  }
}

export async function login(usernameOrEmail: string, password: string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ Email: usernameOrEmail }, { Tentaikhoan: usernameOrEmail }],
      },
      include: {
        role: {
          select: {
            TenNguoiDung: true,
          },
        },
      },
    });

    if (!user || !user.Matkhau) {
      throw new Error("Tài khoản không tồn tại");
    }

    const isValid = await compare(password, user.Matkhau);
    if (!isValid) {
      throw new Error("Sai mật khẩu");
    }

    const token = await new SignJWT({
      idUsers: user.idUsers,
      email: user.Email,
      role: user.role?.TenNguoiDung,
      name: user.Hoten,
      Tentaikhoan: user.Tentaikhoan,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(key);

    const cookieStore = await cookies();
    cookieStore.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
    });

    return {
      idUsers: user.idUsers,
      email: user.Email,
      username: user.Tentaikhoan,
      fullName: user.Hoten,
      role: user.role?.TenNguoiDung,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout() {
  (await cookies()).delete("session-token");
}

export async function getSession() {
  try {
    const token = (await cookies()).get("session-token")?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, key);
    return verified.payload as any;
  } catch (error) {
    return null;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.users.update({
      where: { idUsers: user.idUsers },
      data: {
        Matkhau: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: "Password reset successful" };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error("Failed to reset password");
  }
}
