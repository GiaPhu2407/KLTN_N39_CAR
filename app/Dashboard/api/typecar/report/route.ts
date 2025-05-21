// import prisma from "@/prisma/client";
// import { type NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer";
// import ExcelJS from "exceljs";
// import {
//   Document,
//   Packer,
//   Paragraph,
//   Table,
//   TableRow,
//   TableCell,
//   TextRun,
//   AlignmentType,
//   HeadingLevel,
// } from "docx";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const format = searchParams.get("format") || "pdf";
//     const idsParam = searchParams.get("ids");

//     // Parse the IDs from the query parameter
//     const selectedIds = idsParam
//       ? idsParam.split(",").map((id) => Number.parseInt(id, 10))
//       : [];

//     // Build the where clause based on whether we have selected IDs
//     const whereClause =
//       selectedIds.length > 0 ? { idLoaiXe: { in: selectedIds } } : {};

//     // Lấy danh sách xe từ DB với thông tin loại xe và nhà cung cấp
//     const loaiXeList = await prisma.loaiXe.findMany({
//       where: whereClause,
//       include: {
//         _count: {
//           select: {
//             Xe: true,
//           },
//         },
//       },
//     });

//     const currentDate = new Date().toLocaleDateString("vi-VN");

//     if (format === "pdf") {
//       // Tạo HTML bảng báo cáo với header CHXHCNVN
//       const htmlContent = `
//         <html>
//           <head>
//             <meta charset="UTF-8">
//             <style>
//               body { font-family: 'Times New Roman', Times, serif; margin: 20px; }
//               .header { text-align: center; margin-bottom: 30px; }
//               .header h5 { text-transform: uppercase; font-weight: bold; margin: 5px 0; }
//               .doc-title { text-transform: uppercase; font-weight: bold; font-size: 16pt; margin: 20px 0; }
//               table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//               th, td { border: 1px solid #000; padding: 8px; text-align: center; }
//               th { background-color: #f4f4f4; }
//               .report-date { text-align: right; font-style: italic; margin: 10px 0; }
//               .notes { margin-top: 30px; }
//               .signature { margin-top: 50px; display: flex; justify-content: space-between; }
//               .signature-box { width: 30%; text-align: center; }
//               .signature-line { margin-top: 70px; }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h5>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
//               <h5>Độc lập - Tự do - Hạnh phúc</h5>
//               <div>--------------</div>
//             </div>

//             <h2 class="doc-title" style="text-align: center;">BÁO CÁO DANH SÁCH LOẠI XE Ô TÔ</h2>

//             <p class="report-date">Ngày xuất báo cáo: ${currentDate}</p>

//             <table>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Tên Loại</th>
//                   <th>Nhãn Hiệu</th>
//                   <th>Số Lượng Xe</th>
//                 </tr>
//               </thead>
//               <tbody>
//               ${loaiXeList
//                 .map(
//                   (loaiXe, index) => `
//                     <tr>
//                       <td>${index + 1}</td>
//                       <td>${loaiXe.TenLoai || "N/A"}</td>
//                       <td>${loaiXe.NhanHieu || "N/A"}</td>
//                       <td>${loaiXe._count.Xe || 0}</td>
//                     </tr>`
//                 )
//                 .join("")}
//               </tbody>
//             </table>

//             <div class="signature">
//               <div class="signature-box">
//                 <p><strong>NGƯỜI LẬP BÁO CÁO</strong></p>
//                 <p><em>(Ký, ghi rõ họ tên)</em></p>
//                 <p class="signature-line">&nbsp;</p>
//               </div>
//               <div class="signature-box">
//                 <p><strong>XÁC NHẬN CỦA ĐƠN VỊ</strong></p>
//                 <p><em>(Ký tên, đóng dấu)</em></p>
//                 <p class="signature-line">&nbsp;</p>
//               </div>
//             </div>
//           </body>
//         </html>
//       `;

//       // Khởi tạo Puppeteer & xuất PDF
//       const browser = await puppeteer.launch({
//         headless: true,
//       });
//       const page = await browser.newPage();
//       await page.setContent(htmlContent);
//       const pdfBuffer = await page.pdf({
//         format: "A4",
//         printBackground: true,
//         margin: {
//           top: "20mm",
//           right: "20mm",
//           bottom: "20mm",
//           left: "20mm",
//         },
//       });

//       await browser.close();

//       return new NextResponse(pdfBuffer, {
//         status: 200,
//         headers: {
//           "Content-Type": "application/pdf",
//           "Content-Disposition":
//             'attachment; filename="bao-cao-danh-sach-xe.pdf"',
//           "Content-Length": pdfBuffer.length.toString(),
//         },
//       });
//     } else if (format === "excel") {
//       // Create Excel report
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet("Báo Cáo Loại Xe");

//       // Add header
//       worksheet.mergeCells("A1:D1");
//       worksheet.mergeCells("A2:D2");
//       worksheet.mergeCells("A3:D3");
//       worksheet.mergeCells("A5:D5");

//       const headerRow1 = worksheet.getCell("A1");
//       headerRow1.value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
//       headerRow1.font = { bold: true, size: 14 };
//       headerRow1.alignment = { horizontal: "center" };

//       const headerRow2 = worksheet.getCell("A2");
//       headerRow2.value = "Độc lập - Tự do - Hạnh phúc";
//       headerRow2.font = { bold: true, size: 14 };
//       headerRow2.alignment = { horizontal: "center" };

//       const headerRow3 = worksheet.getCell("A3");
//       headerRow3.value = "--------------";
//       headerRow3.alignment = { horizontal: "center" };

//       const titleRow = worksheet.getCell("A5");
//       titleRow.value = "BÁO CÁO DANH SÁCH LOẠI XE Ô TÔ";
//       titleRow.font = { bold: true, size: 16 };
//       titleRow.alignment = { horizontal: "center" };

//       // Add date
//       worksheet.mergeCells("A7:D7");
//       const dateRow = worksheet.getCell("A7");
//       dateRow.value = `Ngày xuất báo cáo: ${currentDate}`;
//       dateRow.alignment = { horizontal: "right" };

//       // Add table headers
//       const tableHeaderRow = worksheet.addRow([
//         "#",
//         "Tên Loại",
//         "Nhãn Hiệu",
//         "Số Lượng Xe",
//       ]);
//       tableHeaderRow.eachCell((cell) => {
//         cell.font = { bold: true };
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFE0E0E0" },
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//       // Add data rows
//       loaiXeList.forEach((loaiXe, index) => {
//         const row = worksheet.addRow([
//           index + 1,
//           loaiXe.TenLoai || "N/A",
//           loaiXe.NhanHieu || "N/A",
//           loaiXe._count.Xe || 0,
//         ]);

//         row.eachCell((cell) => {
//           cell.border = {
//             top: { style: "thin" },
//             left: { style: "thin" },
//             bottom: { style: "thin" },
//             right: { style: "thin" },
//           };
//         });
//       });

//       // Set column widths
//       worksheet.getColumn(1).width = 10;
//       worksheet.getColumn(2).width = 30;
//       worksheet.getColumn(3).width = 30;
//       worksheet.getColumn(4).width = 15;

//       // Add signature section
//       const signatureRowIndex = loaiXeList.length + 12;
//       worksheet.mergeCells(`A${signatureRowIndex}:B${signatureRowIndex}`);
//       worksheet.mergeCells(`C${signatureRowIndex}:D${signatureRowIndex}`);

//       const signatureLeft = worksheet.getCell(`A${signatureRowIndex}`);
//       signatureLeft.value = "NGƯỜI LẬP BÁO CÁO";
//       signatureLeft.font = { bold: true };
//       signatureLeft.alignment = { horizontal: "center" };

//       const signatureRight = worksheet.getCell(`C${signatureRowIndex}`);
//       signatureRight.value = "XÁC NHẬN CỦA ĐƠN VỊ";
//       signatureRight.font = { bold: true };
//       signatureRight.alignment = { horizontal: "center" };

//       const buffer = await workbook.xlsx.writeBuffer();

//       return new NextResponse(buffer, {
//         status: 200,
//         headers: {
//           "Content-Type":
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//           "Content-Disposition":
//             'attachment; filename="bao-cao-danh-sach-xe.xlsx"',
//         },
//       });
//     } else if (format === "doc") {
//       // Create Word document report
//       const rows = [
//         new TableRow({
//           children: [
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   children: [new TextRun({ text: "#", bold: true })],
//                 }),
//               ],
//             }),
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   children: [new TextRun({ text: "Tên Loại", bold: true })],
//                 }),
//               ],
//             }),
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   children: [new TextRun({ text: "Nhãn Hiệu", bold: true })],
//                 }),
//               ],
//             }),
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   children: [new TextRun({ text: "Số Lượng Xe", bold: true })],
//                 }),
//               ],
//             }),
//           ],
//         }),
//         ...loaiXeList.map(
//           (loaiXe, index) =>
//             new TableRow({
//               children: [
//                 new TableCell({
//                   children: [new Paragraph({ text: (index + 1).toString() })],
//                 }),
//                 new TableCell({
//                   children: [new Paragraph({ text: loaiXe.TenLoai || "N/A" })],
//                 }),
//                 new TableCell({
//                   children: [new Paragraph({ text: loaiXe.NhanHieu || "N/A" })],
//                 }),
//                 new TableCell({
//                   children: [
//                     new Paragraph({ text: (loaiXe._count.Xe || 0).toString() }),
//                   ],
//                 }),
//               ],
//             })
//         ),
//       ];

//       const doc = new Document({
//         sections: [
//           {
//             properties: {},
//             children: [
//               new Paragraph({
//                 text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
//                 heading: HeadingLevel.HEADING_1,
//                 alignment: AlignmentType.CENTER,
//               }),
//               new Paragraph({
//                 text: "Độc lập - Tự do - Hạnh phúc",
//                 heading: HeadingLevel.HEADING_1,
//                 alignment: AlignmentType.CENTER,
//               }),
//               new Paragraph({
//                 text: "--------------",
//                 alignment: AlignmentType.CENTER,
//               }),
//               new Paragraph({
//                 text: "BÁO CÁO DANH SÁCH LOẠI XE Ô TÔ",
//                 heading: HeadingLevel.HEADING_1,
//                 alignment: AlignmentType.CENTER,
//                 spacing: {
//                   before: 400,
//                   after: 400,
//                 },
//               }),
//               new Paragraph({
//                 text: `Ngày xuất báo cáo: ${currentDate}`,
//                 alignment: AlignmentType.RIGHT,
//                 spacing: {
//                   after: 200,
//                 },
//               }),
//               new Table({
//                 rows: rows,
//               }),
//               new Paragraph({
//                 text: "",
//                 spacing: {
//                   before: 500,
//                 },
//               }),
//               new Paragraph({
//                 children: [
//                   new TextRun({
//                     text: "NGƯỜI LẬP BÁO CÁO",
//                     bold: true,
//                   }),
//                 ],
//                 alignment: AlignmentType.LEFT,
//                 indent: {
//                   left: 1000,
//                 },
//               }),
//               new Paragraph({
//                 text: "(Ký, ghi rõ họ tên)",
//                 alignment: AlignmentType.LEFT,
//                 indent: {
//                   left: 1000,
//                 },
//               }),
//               new Paragraph({
//                 children: [
//                   new TextRun({
//                     text: "XÁC NHẬN CỦA ĐƠN VỊ",
//                     bold: true,
//                   }),
//                 ],
//                 alignment: AlignmentType.RIGHT,
//                 indent: {
//                   right: 1000,
//                 },
//               }),
//               new Paragraph({
//                 text: "(Ký tên, đóng dấu)",
//                 alignment: AlignmentType.RIGHT,
//                 indent: {
//                   right: 1000,
//                 },
//               }),
//             ],
//           },
//         ],
//       });

//       const buffer = await Packer.toBuffer(doc);

//       return new NextResponse(buffer, {
//         status: 200,
//         headers: {
//           "Content-Type":
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           "Content-Disposition":
//             'attachment; filename="bao-cao-danh-sach-xe.docx"',
//         },
//       });
//     }

//     return NextResponse.json(
//       { message: "Định dạng không được hỗ trợ" },
//       { status: 400 }
//     );
//   } catch (error: any) {
//     console.error("❌ Lỗi tạo báo cáo:", error);
//     return NextResponse.json({ message: "Lỗi tạo báo cáo" }, { status: 500 });
//   }
// }
import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    // Parse the IDs from the query parameter
    const selectedIds = idsParam
      ? idsParam.split(",").map((id) => Number.parseInt(id, 10))
      : [];

    // Build the where clause based on whether we have selected IDs
    const whereClause =
      selectedIds.length > 0 ? { idLoaiXe: { in: selectedIds } } : {};

    // Lấy danh sách xe từ DB với thông tin loại xe và nhà cung cấp
    const loaiXeList = await prisma.loaiXe.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            Xe: true,
          },
        },
      },
    });

    const currentDate = new Date().toLocaleDateString("vi-VN");

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
          
          <p class="report-date">Ngày xuất báo cáo: ${currentDate}</p>
          
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
                    <td>${loaiXe._count.Xe || 0}</td>
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
    console.error("❌ Lỗi tạo báo cáo:", error);
    return NextResponse.json({ message: "Lỗi tạo báo cáo" }, { status: 500 });
  }
}
