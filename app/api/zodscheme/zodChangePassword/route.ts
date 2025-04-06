import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu hiện tại" })
    .trim(),
  newPassword: z
    .string()
    .min(8, { message: "Mật khẩu mới phải có ít nhất 8 ký tự" })
    .regex(/[A-Za-z]/, {
      message: "Mật khẩu mới phải chứa ít nhất một chữ cái",
    })
    .regex(/[0-9]/, { message: "Mật khẩu mới phải chứa ít nhất một số" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt",
    }),
});

export default ChangePasswordSchema;
