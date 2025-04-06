import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/app/lib/auth";
import SignupFormSchema from "../../zodscheme/zodRegister/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignupFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    const { email, username, password, fullname, phone, address } = result.data;

    // Set role based on username
    const isAdmin = username.toLowerCase().endsWith("admin");
    const roleId = isAdmin ? 2 : 1; // Assuming 1 is admin role and 2 is user role

    const user = await signUp(
      email,
      username,
      password,
      fullname,
      phone,
      address,
      roleId
    );

    return NextResponse.json(
      { user, message: "Đăng ký thành công" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
