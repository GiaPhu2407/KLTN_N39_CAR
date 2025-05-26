import prisma from "@/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
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
  BorderStyle,
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
    // Parse the request body to get the format, selected car IDs, and fields
    const { format, carIds, fields } = await req.json();

    // If no car IDs are provided, return an error
    if (!carIds || carIds.length === 0) {
      return NextResponse.json(
        { error: "No cars selected for export" },
        { status: 400 }
      );
    }

    // Query the database for only the selected cars
    const cars = await prisma.xe.findMany({
      where: {
        idXe: { in: carIds },
      },
      include: {
        loaiXe: true,
        nhaCungCap: true,
      },
    });

    // If no cars were found with the provided IDs
    if (cars.length === 0) {
      return NextResponse.json(
        { error: "No cars found with the provided IDs" },
        { status: 404 }
      );
    }

    // Parse the fields parameter to determine which fields to include
    const fieldsToInclude = fields
      ? fields.split(",")
      : [
          "TenXe",
          "LoaiXe",
          "GiaXe",
          "MauSac",
          "DongCo",
          "TrangThai",
          "NhaCungCap",
          "ThongSoKyThuat",
          "MoTa",
          "HinhAnh", // Thêm Hình Ảnh sau Mô Tả
          "NamSanXuat",
        ];

    // Create a mapping of field IDs to display names
    const fieldDisplayNames: Record<string, string> = {
      TenXe: "Tên Xe",
      LoaiXe: "Loại Xe",
      GiaXe: "Giá Xe",
      MauSac: "Màu Sắc",
      DongCo: "Động Cơ",
      TrangThai: "Trạng Thái",
      NhaCungCap: "Nhà Cung Cấp",
      ThongSoKyThuat: "Thông Số KT",
      MoTa: "Mô Tả",
      HinhAnh: "Hình Ảnh", // Thêm mapping cho Hình Ảnh
      NamSanXuat: "Năm Sản Xuất", // FIX: Đổi từ "Năm SX" thành "Năm Sản Xuất"
    };

    // Create export data with only the selected fields
    const exportData = cars.map((car) => {
      const carData: Record<string, any> = { ID: car.idXe };

      fieldsToInclude.forEach((field: any) => {
        switch (field) {
          case "TenXe":
            carData["Tên Xe"] = car.TenXe;
            break;
          case "LoaiXe":
            carData["Loại Xe"] = car.loaiXe?.TenLoai || "N/A";
            break;
          case "GiaXe":
            carData["Giá Xe"] = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(car.GiaXe));
            break;
          case "MauSac":
            carData["Màu Sắc"] = car.MauSac;
            break;
          case "DongCo":
            carData["Động Cơ"] = car.DongCo;
            break;
          case "TrangThai":
            carData["Trạng Thái"] = car.TrangThai;
            break;
          case "NhaCungCap":
            carData["Nhà Cung Cấp"] = car.nhaCungCap?.TenNhaCungCap || "N/A";
            break;
          case "ThongSoKyThuat":
            carData["Thông Số KT"] = car.ThongSoKyThuat;
            break;
          case "MoTa":
            carData["Mô Tả"] = car.MoTa;
            break;
          case "HinhAnh": // Thêm case cho Hình Ảnh
            carData["Hình Ảnh"] = car.HinhAnh || "N/A";
            break;
          case "NamSanXuat":
            carData["Năm Sản Xuất"] = car.NamSanXuat; // FIX: Sử dụng "Năm Sản Xuất"
            break;
        }
      });

      return carData;
    });

    if (format === "pdf") {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Create table headers based on selected fields
      const tableHeaders = fieldsToInclude
        .map(
          (field: string | number) =>
            `<th>${fieldDisplayNames[field] || field}</th>`
        )
        .join("");

      // Create table rows based on selected fields
      const tableRows = exportData
        .map((car, index) => {
          const cells = fieldsToInclude
            .map((field: string | number) => {
              const displayName = fieldDisplayNames[field] || field;
              let cellValue = car[displayName] || "N/A";

              return `<td>${cellValue}</td>`;
            })
            .join("");

          return `
          <tr>
            <td>${index + 1}</td>
            ${cells}
          </tr>
        `;
        })
        .join("");

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: blue; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f4f4f4; }
              img { max-width: 50px; max-height: 50px; object-fit: cover; }
            </style>
          </head>
          <body>
            <h1>Danh sách xe ô tô</h1>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  ${tableHeaders}
                </tr>
              </thead>
              <tbody>
                ${tableRows}
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
          "Content-Disposition": 'attachment; filename="cars.pdf"',
        },
      });
    }

    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Cars");

      // Add headers based on selected fields
      const headers = [
        "ID",
        ...fieldsToInclude.map(
          (field: string | number) => fieldDisplayNames[field] || field
        ),
      ];
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add data rows
      exportData.forEach((car, rowIndex) => {
        const rowData = [car.ID];
        fieldsToInclude.forEach((field: string | number) => {
          const displayName = fieldDisplayNames[field] || field;
          let cellValue = car[displayName] || "N/A";

          rowData.push(cellValue);
        });
        worksheet.addRow(rowData);
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
          "Content-Disposition": 'attachment; filename="cars.xlsx"',
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

      // Create header cells based on selected fields
      const headerCells = fieldsToInclude.map((field: any) => {
        const displayName =
          fieldDisplayNames[field as keyof typeof fieldDisplayNames] ||
          String(field);
        return new TableCell({
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
                  text: displayName,
                  bold: true,
                  color: "FFFFFF",
                  size: 24,
                }),
              ],
            }),
          ],
          verticalAlign: AlignmentType.CENTER,
        });
      });

      // Add ID column at the beginning
      const headerRow = new TableRow({
        tableHeader: true,
        height: { value: 400, rule: HeightRule.EXACT },
        children: [
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
                    text: "ID",
                    bold: true,
                    color: "FFFFFF",
                    size: 24,
                  }),
                ],
              }),
            ],
            verticalAlign: AlignmentType.CENTER,
          }),
          ...headerCells,
        ],
      });

      // Create data rows
      const dataRows = exportData.map((car, index) => {
        const dataCells = fieldsToInclude.map((field: string) => {
          const displayName = fieldDisplayNames[field] || field;
          let value = car[displayName] || "N/A";
          const isNumeric = field === "GiaXe";

          return new TableCell({
            shading:
              index % 2 === 0
                ? { fill: "F2F2F2", color: "F2F2F2", type: ShadingType.CLEAR }
                : undefined,
            children: [
              new Paragraph({
                alignment: isNumeric ? AlignmentType.RIGHT : AlignmentType.LEFT,
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
        });

        return new TableRow({
          height: { value: 300, rule: HeightRule.ATLEAST },
          children: [
            // ID cell
            new TableCell({
              shading:
                index % 2 === 0
                  ? { fill: "F2F2F2", color: "F2F2F2", type: ShadingType.CLEAR }
                  : undefined,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: String(car.ID),
                      size: 22,
                    }),
                  ],
                }),
              ],
              verticalAlign: AlignmentType.CENTER,
            }),
            ...dataCells,
          ],
        });
      });

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
                        text: "Danh Sách Xe Ô Tô",
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
                    text: "DANH SÁCH XE Ô TÔ",
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
                    text: `Tổng số: ${exportData.length} xe`,
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
          "Content-Disposition": 'attachment; filename="danh-sach-xe.docx"',
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
