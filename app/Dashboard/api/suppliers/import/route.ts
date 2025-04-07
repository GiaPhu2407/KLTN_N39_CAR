import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Không có file được cung cấp' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    
    let records: any[] = [];

    if (fileType === 'excel') {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileType === 'csv') {
      return NextResponse.json(
        { error: 'Định dạng CSV không được hỗ trợ' },
        { status: 400 }
      );
    }

    // Kiểm tra ID trùng lặp trong file import
    const idSet = new Set<number>();
    const duplicateIds: number[] = [];
    
    // Phát hiện các ID trùng lặp trong file import
    records.forEach(record => {
      if (record['ID']) {
        const idNhaCungCap = parseInt(record['ID'], 10);
        if (idSet.has(idNhaCungCap)) {
          duplicateIds.push(idNhaCungCap);
        } else {
          idSet.add(idNhaCungCap);
        }
      }
    });

    // Nếu phát hiện ID trùng lặp trong file import, trả về lỗi
    if (duplicateIds.length > 0) {
      return NextResponse.json(
        { 
          error: 'Phát hiện ID trùng lặp trong file import', 
          duplicateIds 
        },
        { status: 400 }
      );
    }

    // Kiểm tra email trùng lặp
    const emailSet = new Set<string>();
    const duplicateEmails: string[] = [];
    
    records.forEach(record => {
      if (record['Email'] && record['Email'] !== 'N/A') {
        const email = record['Email'].toLowerCase();
        if (emailSet.has(email)) {
          duplicateEmails.push(email);
        } else {
          emailSet.add(email);
        }
      }
    });

    if (duplicateEmails.length > 0) {
      return NextResponse.json(
        { 
          error: 'Phát hiện email trùng lặp trong file import', 
          duplicateEmails 
        },
        { status: 400 }
      );
    }

    // Chuyển đổi và xác thực các bản ghi
    const transformedRecords = records.map(record => {
      // Trích xuất idNhaCungCap nếu có trong file Excel
      const idNhaCungCap = record['ID'] ? parseInt(record['ID'], 10) : undefined;

      // Chuyển đổi bản ghi cho phù hợp với schema cơ sở dữ liệu
      return {
        ...(idNhaCungCap && { idNhaCungCap }), // Chỉ bao gồm ID nếu nó tồn tại trong file import
        TenNhaCungCap: record['Tên Nhà Cung Cấp'] || null,
        Sdt: record['Số Điện Thoại'] || null,
        Email: record['Email'] === 'N/A' ? null : record['Email'] || null
      };
    });

    // Kiểm tra xem có ID nào trong file đã tồn tại trong database
    const existingIds = new Set<number>();
    for (const record of transformedRecords) {
      if (record.idNhaCungCap) {
        const existing = await prisma.nhaCungCap.findUnique({
          where: { idNhaCungCap: record.idNhaCungCap }
        });
        if (existing) {
          existingIds.add(record.idNhaCungCap);
        }
      }
    }

    // Kiểm tra xem có email nào trong file đã tồn tại trong database
    const existingEmails = new Set<string>();
    for (const record of transformedRecords) {
      if (record.Email) {
        const existing = await prisma.nhaCungCap.findUnique({
          where: { Email: record.Email }
        });
        if (existing && (!record.idNhaCungCap || existing.idNhaCungCap !== record.idNhaCungCap)) {
          existingEmails.add(record.Email);
        }
      }
    }

    if (existingEmails.size > 0) {
      return NextResponse.json(
        { 
          error: 'Các email này đã tồn tại trong cơ sở dữ liệu', 
          existingEmails: Array.from(existingEmails) 
        },
        { status: 400 }
      );
    }

    // Sử dụng giao dịch (transaction) để xử lý lỗi tốt hơn
    const result = await prisma.$transaction(async (tx) => {
      let created = 0;
      let updated = 0;
      let skipped = 0;

      // Xử lý từng bản ghi riêng lẻ để xử lý lỗi tốt hơn
      for (const record of transformedRecords) {
        try {
          if (record.idNhaCungCap !== undefined) {
            // Kiểm tra xem bản ghi có tồn tại không
            const existingRecord = await tx.nhaCungCap.findUnique({
              where: { idNhaCungCap: record.idNhaCungCap }
            });

            if (existingRecord) {
              // Cập nhật bản ghi hiện có
              await tx.nhaCungCap.update({
                where: { idNhaCungCap: record.idNhaCungCap },
                data: record
              });
              updated++;
            } else {
              // Tạo bản ghi mới với ID cụ thể
              await tx.nhaCungCap.create({
                data: record
              });
              created++;
            }
          } else {
            // Tạo bản ghi mới không có ID cụ thể
            await tx.nhaCungCap.create({
              data: record
            });
            created++;
          }
        } catch (err) {
          console.error(`Lỗi xử lý bản ghi:`, record, err);
          skipped++;
        }
      }

      return { created, updated, skipped };
    });

    return NextResponse.json({
      success: true,
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
      totalProcessed: transformedRecords.length,
      existingIds: Array.from(existingIds)
    });

  } catch (error: any) {
    console.error('Lỗi nhập dữ liệu:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}