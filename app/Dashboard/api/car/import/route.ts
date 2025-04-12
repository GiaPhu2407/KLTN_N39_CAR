import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    let records: any[] = [];

    if (fileType === "excel") {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileType === "csv") {
      return NextResponse.json(
        { error: "CSV format is not supported" },
        { status: 400 }
      );
    }

    // First, fetch all loaiXe to map names to IDs
    const loaiXeList = await prisma.loaiXe.findMany();
    const loaiXeMap = new Map(
      loaiXeList.map((loai) => [loai.TenLoai, loai.idLoaiXe])
    );

    // Fetch all NhaCungCap to map names to IDs
    const nhaCungCapList = await prisma.nhaCungCap.findMany();
    const nhaCungCapMap = new Map(
      nhaCungCapList.map((ncc) => [ncc.TenNhaCungCap, ncc.idNhaCungCap])
    );

    // Check for duplicate car names within the import file
    const nameSet = new Set<string>();
    const duplicateNames: string[] = [];

    records.forEach((record) => {
      if (record["Tên Xe"]) {
        const carName = record["Tên Xe"].trim();
        if (nameSet.has(carName)) {
          duplicateNames.push(carName);
        } else {
          nameSet.add(carName);
        }
      }
    });

    // Return error if duplicate names found in the import file
    if (duplicateNames.length > 0) {
      return NextResponse.json(
        {
          error: "Duplicate car names found",
          duplicateNames,
        },
        { status: 400 }
      );
    }

    // Check for duplicate IDs in the import file
    const idSet = new Set<number>();
    const duplicateIds: number[] = [];

    records.forEach((record) => {
      if (record["ID Xe"]) {
        const idXe = parseInt(record["ID Xe"], 10);
        if (idSet.has(idXe)) {
          duplicateIds.push(idXe);
        } else {
          idSet.add(idXe);
        }
      }
    });

    // Return error if duplicate IDs found in the import file
    if (duplicateIds.length > 0) {
      return NextResponse.json(
        {
          error: "Duplicate IDs found in import file",
          duplicateIds,
        },
        { status: 400 }
      );
    }

    // Check for existing car names in the database
    const carNames = records
      .map((record) => record["Tên Xe"]?.trim())
      .filter(Boolean);

    if (carNames.length > 0) {
      const existingCars = await prisma.xe.findMany({
        where: {
          TenXe: {
            in: carNames,
          },
        },
        select: {
          TenXe: true,
        },
      });

      const existingCarNames = existingCars.map((car) => car.TenXe);

      if (existingCarNames.length > 0) {
        return NextResponse.json(
          {
            error: "Car names already exist in database",
            existingNames: existingCarNames,
          },
          { status: 400 }
        );
      }
    }

    // Transform and validate the records
    const transformedRecords = records.map((record) => {
      // Get loaiXe ID from name
      const loaiXeName = record["Loại Xe"];
      const idLoaiXe = loaiXeMap.get(loaiXeName);

      if (!idLoaiXe) {
        throw new Error(`Invalid Loại Xe: ${loaiXeName}`);
      }

      // Get NhaCungCap ID from name, but allow for null/undefined/N/A values
      const nhaCungCapName = record["Nhà Cung Cấp"];
      let idNhaCungCap = null;

      // Only try to map to an ID if we have a valid supplier name
      if (
        nhaCungCapName &&
        nhaCungCapName !== "N/A" &&
        nhaCungCapName !== "null" &&
        nhaCungCapName !== "undefined"
      ) {
        idNhaCungCap = nhaCungCapMap.get(nhaCungCapName);

        // If a supplier name was provided but not found in the database, throw error
        if (!idNhaCungCap) {
          throw new Error(`Invalid Nhà Cung Cấp: ${nhaCungCapName}`);
        }
      }

      // Parse price from formatted string (remove currency symbol and commas)
      const priceString = record["Giá Xe"]
        ? record["Giá Xe"]
            .replace(/[^\d,]/g, "") // Remove currency symbol and any non-digit characters except commas
            .replace(/,/g, "") // Remove commas
        : "0";
      const giaXe = parseInt(priceString, 10);

      // Extract idXe if present in the Excel file
      const idXe = record["ID Xe"] ? parseInt(record["ID Xe"], 10) : undefined;

      // Convert manufacturing year to string if it exists
      const namSanXuat = record["Năm Sản Xuất"]
        ? String(record["Năm Sản Xuất"])
        : null;

      // Transform the record to match database schema
      return {
        ...(idXe && { idXe }), // Only include idXe if it exists in the import file
        TenXe: record["Tên Xe"].trim(),
        idLoaiXe: idLoaiXe,
        GiaXe: giaXe,
        MauSac: record["Màu Sắc"] || null,
        DongCo: record["Động Cơ"] || null,
        TrangThai: record["Trạng Thái"] || null,
        NamSanXuat: namSanXuat,
        ThongSoKyThuat: record["Thông Số Kỹ Thuật"] || null,
        MoTa: record["Mô Tả"] || null,
        ...(idNhaCungCap !== null ? { idNhaCungCap } : {}), // Only include supplier ID if valid
        HinhAnh: record["Hình Ảnh"] || null,
      };
    });

    // Use transactions for better error handling
    const result = await prisma.$transaction(async (tx) => {
      let created = 0;
      let updated = 0;
      let skipped = 0;

      // Process each record individually for better error handling
      for (const record of transformedRecords) {
        try {
          if (record.idXe !== undefined) {
            // Check if record exists
            const existingRecord = await tx.xe.findUnique({
              where: { idXe: record.idXe },
            });

            if (existingRecord) {
              // Update existing record
              await tx.xe.update({
                where: { idXe: record.idXe },
                data: record,
              });
              updated++;
            } else {
              // Create new record with specific ID
              await tx.xe.create({
                data: record,
              });
              created++;
            }
          } else {
            // Create new record without specific ID
            await tx.xe.create({
              data: record,
            });
            created++;
          }
        } catch (err) {
          console.error(`Error processing record:`, record, err);
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
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
