"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TableCarDashboard from "../component/Table/TableCarManager";
import { Xe } from "@prisma/client";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
}

interface FormData {
  TenXe: string;
  idLoaiXe: string;
  GiaXe: string;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string[];
  NamSanXuat: string;
}

export default function Page() {
  const initialFormData: FormData = {
    TenXe: "",
    idLoaiXe: "",
    GiaXe: "",
    MauSac: "",
    DongCo: "",
    TrangThai: "",
    HinhAnh: [],
    NamSanXuat: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaiXeList, setLoaiXeList] = useState<LoaiXe[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleExport = (type: string) => {
    toast.success(`Đã xuất file ${type}`);
    setShowExportOptions(false);
    // Thêm logic xuất file tại đây
  };

  const handleGenerateReport = () => {
    toast.success("Đã tạo báo cáo");
    // Thêm logic tạo báo cáo tại đây
  };

  const handleImport = () => {
    // Thêm logic import file tại đây
    toast.success("Đã import file");
  };

  return (
    <div
      className="p-2 flex-col justify-center text-center w-full h-[630px]"
      data-theme="light"
    >
      <Toaster />
      <div className="flex pb-4 w-full">
        <h1 className="text-2xl mr-[700px] font-bold flex-grow text-black">
          Quản Lý Sản Phẩm
        </h1>
        <button className="btn text-xs btn-accent">Thêm mới</button>
      </div>
      <div className="flex-grow flex justify-end gap-2">
        <button className="btn text-xs btn-accent" onClick={handleImport}>
          Import File
        </button>

        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn text-xs btn-primary"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            Export
          </button>
        </div>
        <select id="pageSize" className="border rounded px-2 py-1">
          <option value="Word">Word </option>
          <option value="Excel">Excel</option>
          <option value="PDF">PDF</option>
        </select>
        <button
          className="btn text-xs btn-success"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-[20000px]">
              <form className="space-y-4">
                {/* Rest of the form content remains the same */}

                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TenXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Xe
                      </label>
                      <input
                        type="text"
                        id="TenXe"
                        name="TenXe"
                        value={formData.TenXe}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="idLoaiXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Loại Xe
                      </label>
                      <select
                        id="idLoaiXe"
                        name="idLoaiXe"
                        value={formData.idLoaiXe}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn loại xe</option>
                        {loaiXeList.map((loaiXe) => (
                          <option
                            key={loaiXe.idLoaiXe}
                            value={loaiXe.idLoaiXe}
                            className="text-black"
                          >
                            {loaiXe.TenLoai}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Continue with rest of the form fields... */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="GiaXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Giá Xe
                      </label>
                      <input
                        type="text"
                        id="GiaXe"
                        name="GiaXe"
                        value={formData.GiaXe}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="MauSac"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Màu Sắc
                      </label>
                      <input
                        type="text"
                        id="MauSac"
                        name="MauSac"
                        value={formData.MauSac}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="DongCo"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Động Cơ
                      </label>
                      <input
                        type="text"
                        id="DongCo"
                        name="DongCo"
                        value={formData.DongCo}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="NamSanXuat"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Năm Sản Xuất
                      </label>
                      <input
                        type="number"
                        id="NamSanXuat"
                        name="NamSanXuat"
                        value={formData.NamSanXuat}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1 w-14">
                      <label
                        htmlFor="TrangThai"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Trạng Thái
                      </label>
                      <select
                        id="TrangThai"
                        name="TrangThai"
                        value={formData.TrangThai}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="Còn Hàng">Còn Hàng</option>
                        <option value="Hết Hàng">Hết Hàng</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="HinhAnh"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Hình Ảnh
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isEditing ? "Cập Nhật" : "Thêm Mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
      <div className="flex w-full justify-center h-full" data-theme="light">
        <TableCarDashboard />
      </div>
    </div>
  );
}
