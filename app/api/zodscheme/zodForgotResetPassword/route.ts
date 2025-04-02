import { z } from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .trim(),
});

export const ResetPasswordFormSchema = z.object({
  token: z
    .string()
    .min(1, { message: "Token không được để trống" }),
  newPassword: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/[A-Za-z]/, { message: "Mật khẩu phải chứa ít nhất một chữ cái" })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất một số" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
    })
});



export default { ForgotPasswordFormSchema, ResetPasswordFormSchema};