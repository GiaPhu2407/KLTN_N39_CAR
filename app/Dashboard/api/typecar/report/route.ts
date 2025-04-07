import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
  try {
    // Lấy danh sách xe từ DB với thông tin loại xe và nhà cung cấp
    const loaiXeList = await prisma.loaiXe.findMany({
      include: {
        _count: {
          select: {
            Xe: true,
            // LichHen: true,
          },
        },
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
          
          <h2 class="doc-title" style="text-align: center;">BÁO CÁO DANH SÁCH LOẠI XE Ô TÔ</h2>
          
          <p class="report-date">Ngày xuất báo cáo: ${new Date().toLocaleDateString(
            "vi-VN"
          )}</p>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Loại</th>
                <th>Nhãn Hiệu</th>
                <th>Số Lượng Xe</th>
              </tr>
            </thead>
            <tbody>
            ${loaiXeList
              .map(
                (loaiXe, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${loaiXe.TenLoai || "N/A"}</td>
                    <td>${loaiXe.NhanHieu || "N/A"}</td>
                    <td>${loaiXe._count.Xe || "N/A"}</td>
                  </tr>`
              )
              .join("")}
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
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="bao-cao-danh-sach-xe.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Lỗi tạo PDF:", error);
    return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
  }
}
