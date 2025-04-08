import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  try {
    // Lấy danh sách xe từ DB với thông tin loại xe và nhà cung cấp
    const xeList = await prisma.xe.findMany({
      include: { 
        loaiXe: true, 
        nhaCungCap: true
      },
    });

    // Tạo HTML bảng báo cáo với header CHXHCNVN
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h5 { text-transform: uppercase; font-weight: bold; margin: 5px 0; }
            .doc-title { text-transform: uppercase; font-weight: bold; font-size: 16pt; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #f4f4f4; }
            .report-date { text-align: right; font-style: italic; margin: 10px 0; }
            .notes { margin-top: 30px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { width: 30%; text-align: center; }
            .signature-line { margin-top: 70px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h5>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
            <h5>Độc lập - Tự do - Hạnh phúc</h5>
            <div>--------------</div>
          </div>
          
          <h2 class="doc-title" style="text-align: center;">BÁO CÁO DANH SÁCH XE Ô TÔ</h2>
          
          <p class="report-date">Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}</p>
          
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Xe</th>
                <th>Loại Xe</th>
                <th>Nhà Cung Cấp</th>
                <th>Giá Xe</th>
                <th>Màu Sắc</th>
                <th>Động Cơ</th>
                <th>Trạng Thái</th>
                <th>Thông Số KT</th>
                <th>Mô Tả</th>
                <th>Năm SX</th>
              </tr>
            </thead>
            <tbody>
              ${xeList
                .map(
                  (xe, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${xe.TenXe || 'N/A'}</td>
                    <td>${xe.loaiXe?.TenLoai || 'N/A'}</td>
                    <td>${xe.nhaCungCap?.TenNhaCungCap || 'N/A'}</td>
                    <td>${xe.GiaXe ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(Number(xe.GiaXe)) : 'N/A'}</td>
                    <td>${xe.MauSac || 'N/A'}</td>
                    <td>${xe.DongCo || 'N/A'}</td>
                    <td>${xe.TrangThai || 'N/A'}</td>
                    <td>${xe.ThongSoKyThuat || 'N/A'}</td>
                    <td>${xe.MoTa || 'N/A'}</td>
                    <td>${xe.NamSanXuat || 'N/A'}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
          
          <div class="signature">
            <div class="signature-box">
              <p><strong>NGƯỜI LẬP BÁO CÁO</strong></p>
              <p><em>(Ký, ghi rõ họ tên)</em></p>
              <p class="signature-line">&nbsp;</p>
            </div>
            <div class="signature-box">
              <p><strong>XÁC NHẬN CỦA ĐƠN VỊ</strong></p>
              <p><em>(Ký tên, đóng dấu)</em></p>
              <p class="signature-line">&nbsp;</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Khởi tạo Puppeteer & xuất PDF
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="bao-cao-danh-sach-xe.pdf"',
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('❌ Lỗi tạo PDF:', error);
    return NextResponse.json({ message: 'Lỗi tạo PDF' }, { status: 500 });
  }
}