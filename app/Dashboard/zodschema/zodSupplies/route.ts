import { z } from "zod";

export const nhaCungCapSchema = z.object({
  TenNhaCungCap: z.string()
    .min(1, "Tên nhà cung cấp không được để trống")
    .max(225, "Tên nhà cung cấp không được vượt quá 225 ký tự"),
  
  Sdt: z.string()
    .min(1, "Số điện thoại không được để trống")
    .max(15, "Số điện thoại không được vượt quá 15 ký tự")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa các chữ số"),
  
  Email: z.string()
    .min(1, "Email không được để trống")
    .max(225, "Email không được vượt quá 225 ký tự")
    .email("Email không đúng định dạng")
});

export default nhaCungCapSchema;