import prisma from '@/prisma/client';
import nodemailer from 'nodemailer';
import { SignJWT } from 'jose';

// Đảm bảo rằng biến môi trường đã được đặt tên chính xác và được thiết lập đúng cách
const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc cấu hình SMTP riêng của bạn
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Sử dụng mật khẩu ứng dụng cho Gmail
    }
});

export async function initiatePasswordReset(email: string) {
    try {
        // Kiểm tra xem người dùng có tồn tại không
        const user = await prisma.users.findUnique({
            where: { Email: email }
        });
  
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }
  
        // Tạo một token đặt lại mật khẩu
        const resetToken = await new SignJWT({
            userId: user.idUsers,
            email: user.Email,
            purpose: 'password-reset'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(key);
  
        // Lưu token đặt lại mật khẩu vào cơ sở dữ liệu
        await prisma.users.update({
            where: { idUsers: user.idUsers },
            data: {
                resetToken: resetToken,
                resetTokenExpiry: new Date(Date.now() + 3600000) // 1 giờ
            }
        });
  
        // Tạo URL đặt lại mật khẩu
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ResetPassword?token=${resetToken}`;
  
        // Mẫu email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tiếp tục:</p>
                    <div style="margin: 20px 0;">
                        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p>Link này sẽ hết hạn sau 1 giờ.</p>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            `
        };
  
        // Gửi email
        await transporter.sendMail(mailOptions);
  
        return { message: 'Email yêu cầu đặt lại mật khẩu đã được gửi thành công' };
  
    } catch (error) {
        console.error('Lỗi khi khởi tạo yêu cầu đặt lại mật khẩu:', error);
        throw new Error('Không thể khởi tạo yêu cầu đặt lại mật khẩu');
    }
}
