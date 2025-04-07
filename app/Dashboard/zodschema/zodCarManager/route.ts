// Validation utility for car management
import { z } from 'zod';

// Define the schema for car validation
export const carSchema = z.object({
  TenXe: z.string()
    .min(1, 'Tên xe không được để trống')
    .max(225, 'Tên xe không được vượt quá 225 ký tự'),
  
  idLoaiXe: z.string()
    .refine(val => !isNaN(parseInt(val)), 'Loại xe không hợp lệ')
    .transform(val => parseInt(val)),
  
  GiaXe: z.string()
    .refine(val => {
      // Remove currency formatting and check if it's a valid number
      const numericValue = val.replace(/[^\d]/g, '');
      return !isNaN(parseFloat(numericValue)) && parseFloat(numericValue) > 0;
    }, 'Giá xe phải là số dương'),
  
  MauSac: z.string()
    .min(1, 'Màu sắc không được để trống')
    .max(50, 'Màu sắc không được vượt quá 50 ký tự'),
  
  DongCo: z.string()
    .min(1, 'Động cơ không được để trống')
    .max(225, 'Động cơ không được vượt quá 225 ký tự'),
  
  TrangThai: z.enum(['Còn Hàng', 'Hết Hàng'], {
    errorMap: () => ({ message: 'Trạng thái phải là Còn Hàng hoặc Hết Hàng' })
  }),
  
  HinhAnh: z.array(z.string())
    .refine(val => val.length > 0, 'Cần tối thiểu 1 hình ảnh')
    .or(z.string().array().nonempty('Cần tối thiểu 1 hình ảnh')),
  
  NamSanXuat: z.string()
    .refine(val => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return !isNaN(year) && year >= 1900 && year <= currentYear + 1;
    }, 'Năm sản xuất không hợp lệ')
});

// Validate car data and return result
export const validateCar = (data: any) => {
  try {
    // Ensure HinhAnh is an array
    const preparedData = {
      ...data,
      HinhAnh: Array.isArray(data.HinhAnh) ? data.HinhAnh : [data.HinhAnh].filter(Boolean)
    };
    
    const result = carSchema.safeParse(preparedData);
    
    if (!result.success) {
      // Format errors into a readable object
      const formattedErrors = result.error.format();
      return {
        success: false,
        errors: formattedErrors
      };
    }
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      errors: { _errors: ['Lỗi xác thực dữ liệu'] }
    };
  }
};

// Check if a car with the same name already exists
export const checkCarExists = async (prisma: any, name: string, id?: number) => {
  const query: any = { TenXe: name };
  
  // If updating, exclude the current car from the check
  if (id) {
    query.NOT = { idXe: id };
  }
  
  const existingCar = await prisma.xe.findFirst({
    where: query
  });
  
  return existingCar !== null;
};