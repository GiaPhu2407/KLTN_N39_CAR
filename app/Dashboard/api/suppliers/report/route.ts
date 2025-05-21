import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    // Get selected IDs from request body
    const body = await req.json();
    const { selectedIds = [] } = body;

    // Create where clause if selectedIds is not empty
    const where =
      selectedIds.length > 0
        ? { idNhaCungCap: { in: selectedIds } }
        : undefined;

    // Lấy danh sách nhà cung cấp từ DB với thông tin xe
    const nhaCungCapList = await prisma.nhaCungCap.findMany({
      where,
      include: {
        xe: {
          include: {
            loaiXe: true,
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
            .car-list { font-size: 10pt; text-align: left; }
          </style>
        </head>
        <body>
          <div class="header">
            <h5>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
            <h5>Độc lập - Tự do - Hạnh phúc</h5>
            <div>--------------</div>
          </div>
          
          <h2 class="doc-title" style="text-align: center;">BÁO CÁO DANH SÁCH NHÀ CUNG CẤP</h2>
          
          <p class="report-date">Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}</p>
          
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Nhà Cung Cấp</th>
                <th>Số Điện Thoại</th>
                <th>Email</th>
                <th>Số Lượng Xe</th>
                <th>Danh Sách Xe</th>
              </tr>
            </thead>
            <tbody>
              ${nhaCungCapList
                .map(
                  (ncc, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${ncc.TenNhaCungCap || "N/A"}</td>
                    <td>${ncc.Sdt || "N/A"}</td>
                    <td>${ncc.Email || "N/A"}</td>
                    <td>${ncc.xe.length}</td>
                    <td class="car-list">${
                      ncc.xe.length > 0
                        ? ncc.xe
                            .map(
                              (xe) =>
                                `${xe.TenXe} (${xe.loaiXe?.TenLoai || "N/A"})`
                            )
                            .join(", ")
                        : "Không có xe"
                    }</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="notes">
            <p><strong>Tổng số nhà cung cấp:</strong> ${nhaCungCapList.length}</p>
            <p><strong>Tổng số xe từ các nhà cung cấp:</strong> ${nhaCungCapList.reduce((total, ncc) => total + ncc.xe.length, 0)}</p>
            ${selectedIds.length > 0 ? `<p><em>* Báo cáo này chỉ hiển thị ${selectedIds.length} nhà cung cấp đã được chọn</em></p>` : ""}
          </div>
          
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
          'attachment; filename="bao-cao-nha-cung-cap.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Lỗi tạo PDF:", error);
    return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
  }
}
