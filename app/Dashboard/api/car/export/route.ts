import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
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
  HeightRule
} from 'docx';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';
    const search = searchParams.get('search') || '';

    const cars = await prisma.xe.findMany({
      where: {
        OR: [
          { TenXe: { contains: search } },
          { MauSac: { contains: search } },
          { DongCo: { contains: search } }
        ]
      },
      include: {
        loaiXe: true,
        nhaCungCap:true
      }  
    });

    const exportData = cars.map(car => ({
      'ID': car.idXe,
      'Tên Xe': car.TenXe,
      'Loại Xe': car.loaiXe?.TenLoai || 'N/A',
      'Giá Xe': new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(Number(car.GiaXe)),
      'Màu Sắc': car.MauSac,
      'Động Cơ': car.DongCo,
      'Trạng Thái': car.TrangThai,
      'Nhà Cung Cấp': car.nhaCungCap?.TenNhaCungCap || 'N/A',
      'Thông Số Kỹ Thuật': car.ThongSoKyThuat,
      'Mô Tả': car.MoTa,
      'Hình Ảnh': car.HinhAnh,
      'Năm Sản Xuất': car.NamSanXuat
    }));

    if (format === 'pdf') {
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
            <h1>Danh sách xe ô tô</h1>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên Xe</th>
                  <th>Loại Xe</th>
                  <th>Giá Xe</th>
                  <th>Màu Sắc</th>
                  <th>Động Cơ</th>
                  <th>Trạng Thái</th>
                  <th>Năm SX</th>
                </tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (car, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${car["Tên Xe"]}</td>
                      <td>${car["Loại Xe"]}</td>
                      <td>${car["Giá Xe"]}</td>
                      <td>${car["Màu Sắc"]}</td>
                      <td>${car["Động Cơ"]}</td>
                      <td>${car["Trạng Thái"]}</td>
                      <td>${car["Nhà Cung Cấp"]}</td>
                      <td>${car["Thông Số Kỹ Thuật"]}</td>
                      <td>${car["Mô Tả"]}</td>
                      <td>${car["Năm Sản Xuất"]}</td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="cars.pdf"'
        }
      });
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cars');

      const headers = Object.keys(exportData[0]);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      exportData.forEach(car => {
        worksheet.addRow(Object.values(car));
      });

      worksheet.columns.forEach(column => {
        column.width = 20;
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="cars.xlsx"'
        }
      });
    }

    if (format === 'doc') {
      // Tạo border và style cho bảng
      const tableBorders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
      };

      // Tạo header row với style - đã sửa lỗi height property
      const headerRow = new TableRow({
        tableHeader: true,
        height: { value: 400, rule: HeightRule.EXACT },
        children: Object.keys(exportData[0]).map(header => 
          new TableCell({
            shading: {
              fill: "3366CC",
              color: "3366CC",
              type: ShadingType.CLEAR
            },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ 
                text: header, 
                bold: true,
                color: "FFFFFF",
                size: 24
              })]
            })],
            verticalAlign: AlignmentType.CENTER
          })
        )
      });

      // Tạo data rows - đã sửa lỗi height property và shading
      const dataRows = exportData.map((car, index) => 
        new TableRow({
          height: { value: 300, rule: HeightRule.ATLEAST },
          children: Object.entries(car).map(([key, value]) => {
            // Căn phải cho các ô có giá trị số
            const isNumeric = key === 'Giá Xe' || key === 'ID';
            
            return new TableCell({
              shading: index % 2 === 0 ? {
                fill: "F2F2F2",
                color: "F2F2F2",
                type: ShadingType.CLEAR
              } : undefined,
              children: [new Paragraph({
                alignment: isNumeric ? AlignmentType.RIGHT : AlignmentType.LEFT,
                children: [new TextRun({ 
                  text: String(value),
                  size: 22
                })]
              })],
              verticalAlign: AlignmentType.CENTER
            });
          })
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
                color: "2E74B5"
              },
              paragraph: {
                spacing: {
                  after: 200
                },
                alignment: AlignmentType.CENTER
              }
            }
          ]
        },
        sections: [{
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE
              },
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000
              }
            }
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
                      size: 20
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun("Trang "),
                    new TextRun({
                      children: [PageNumber.CURRENT]
                    }),
                    new TextRun(" / "),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES]
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}`,
                      size: 18
                    })
                  ]
                })
              ]
            })
          },
          children: [
            new Paragraph({
              style: "title",
              children: [
                new TextRun({
                  text: "DANH SÁCH XE Ô TÔ",
                  bold: true,
                  size: 40
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400
              },
              children: [
                new TextRun({
                  text: `Tổng số: ${exportData.length} xe`,
                  italics: true,
                  size: 24
                })
              ]
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              borders: tableBorders,
              rows: [headerRow, ...dataRows]
            }),
            new Paragraph({
              spacing: {
                before: 400
              },
              children: [
                new TextRun({
                  text: "* Lưu ý: Document này được tạo tự động bởi hệ thống.",
                  italics: true,
                  size: 20
                })
              ]
            })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="danh-sach-xe.docx"'
        }
      });
    }
    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
