import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  BorderStyle,
  TableBorders,
  WidthType,
  AlignmentType,
  Header,
  Footer,
  PageOrientation,
  PageNumber,
  ShadingType,
  HeightRule,
} from "docx";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format = "excel", selectedIds = [] } = body;

    // Determine if we need to export all or just selected suppliers
    const where =
      selectedIds.length > 0
        ? { idNhaCungCap: { in: selectedIds } }
        : undefined;

    // Fetch suppliers based on selection criteria
    const suppliers = await prisma.nhaCungCap.findMany({
      where,
      include: {
        xe: {
          select: {
            idXe: true,
            TenXe: true,
          },
        },
      },
    });

    const exportData = suppliers.map((supplier) => ({
      ID: supplier.idNhaCungCap,
      "Tên Nhà Cung Cấp": supplier.TenNhaCungCap || "N/A",
      "Số Điện Thoại": supplier.Sdt || "N/A",
      Email: supplier.Email || "N/A",
    }));

    // Return appropriate error if no data to export
    if (exportData.length === 0) {
      return NextResponse.json(
        { error: "Không có dữ liệu để xuất" },
        { status: 400 }
      );
    }

    if (format === "pdf") {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: blue; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <h1>Danh sách nhà cung cấp</h1>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên Nhà Cung Cấp</th>
                  <th>Số Điện Thoại</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (supplier, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${supplier["Tên Nhà Cung Cấp"]}</td>
                      <td>${supplier["Số Điện Thoại"]}</td>
                      <td>${supplier["Email"]}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: "A4" });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="nha-cung-cap.pdf"',
        },
      });
    }

    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Suppliers");

      const headers = Object.keys(exportData[0]);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      exportData.forEach((supplier) => {
        worksheet.addRow(Object.values(supplier));
      });

      worksheet.columns.forEach((column) => {
        column.width = 20;
        column.alignment = { vertical: "middle", horizontal: "left" };
      });

      const buffer = await workbook.xlsx.writeBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="nha-cung-cap.xlsx"',
        },
      });
    }

    if (format === "doc") {
      // Tạo border và style cho bảng
      const tableBorders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: "000000",
        },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      };

      // Tạo header row với style
      const headerRow = new TableRow({
        tableHeader: true,
        height: { value: 400, rule: HeightRule.EXACT },
        children: Object.keys(exportData[0]).map(
          (header) =>
            new TableCell({
              shading: {
                fill: "3366CC",
                color: "3366CC",
                type: ShadingType.CLEAR,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: header,
                      bold: true,
                      color: "FFFFFF",
                      size: 24,
                    }),
                  ],
                }),
              ],
              verticalAlign: AlignmentType.CENTER,
            })
        ),
      });

      // Tạo data rows
      const dataRows = exportData.map(
        (supplier, index) =>
          new TableRow({
            height: { value: 300, rule: HeightRule.ATLEAST },
            children: Object.entries(supplier).map(([key, value]) => {
              // Căn phải cho các ô có giá trị số
              const isNumeric = key === "ID" || key === "Số Lượng Xe";

              return new TableCell({
                shading:
                  index % 2 === 0
                    ? {
                        fill: "F2F2F2",
                        color: "F2F2F2",
                        type: ShadingType.CLEAR,
                      }
                    : undefined,
                children: [
                  new Paragraph({
                    alignment: isNumeric
                      ? AlignmentType.RIGHT
                      : AlignmentType.LEFT,
                    children: [
                      new TextRun({
                        text: String(value),
                        size: 22,
                      }),
                    ],
                  }),
                ],
                verticalAlign: AlignmentType.CENTER,
              });
            }),
          })
      );

      // Tạo tài liệu với header, footer và các cài đặt trang
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "title",
              name: "Title",
              basedOn: "Normal",
              next: "Normal",
              run: {
                size: 36,
                bold: true,
                color: "2E74B5",
              },
              paragraph: {
                spacing: {
                  after: 200,
                },
                alignment: AlignmentType.CENTER,
              },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: PageOrientation.LANDSCAPE,
                },
                margin: {
                  top: 1000,
                  right: 1000,
                  bottom: 1000,
                  left: 1000,
                },
              },
            },
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: "Danh Sách Nhà Cung Cấp",
                        bold: true,
                        size: 20,
                      }),
                    ],
                  }),
                ],
              }),
            },
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Trang "),
                      new TextRun({
                        children: [PageNumber.CURRENT],
                      }),
                      new TextRun(" / "),
                      new TextRun({
                        children: [PageNumber.TOTAL_PAGES],
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `Xuất ngày: ${new Date().toLocaleDateString("vi-VN")}`,
                        size: 18,
                      }),
                    ],
                  }),
                ],
              }),
            },
            children: [
              new Paragraph({
                style: "title",
                children: [
                  new TextRun({
                    text: "DANH SÁCH NHÀ CUNG CẤP",
                    bold: true,
                    size: 40,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: {
                  after: 400,
                },
                children: [
                  new TextRun({
                    text: `Tổng số: ${exportData.length} nhà cung cấp`,
                    italics: true,
                    size: 24,
                  }),
                ],
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                borders: tableBorders,
                rows: [headerRow, ...dataRows],
              }),
              new Paragraph({
                spacing: {
                  before: 400,
                },
                children: [
                  new TextRun({
                    text: "* Lưu ý: Document này được tạo tự động bởi hệ thống.",
                    italics: true,
                    size: 20,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition":
            'attachment; filename="danh-sach-nha-cung-cap.docx"',
        },
      });
    }

    return NextResponse.json(
      { error: "Định dạng không được hỗ trợ" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
