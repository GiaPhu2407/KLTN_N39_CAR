import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Xe {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  idLoaiXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string;
  NamSanXuat: string;
  loaiXe?: {
    TenLoai: string;
    NhanHieu: string;
  };
}

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
}

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableCarDashboard: React.FC = ({}) => {
  const [isXeTable, setXeTable] = useState<Xe[]>([]);
  const [isLoaiXeTable, setLoaiXeTable] = useState<LoaiXe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Màu sắc cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Còn Hàng":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "Hết Hàng":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="flex justify-between pb-5">
          <div className="mt-6">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700"
            >
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              className="ml-2 border border-gray-300 rounded px-3 py-1 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input border border-gray-300 rounded-lg h-10 text-sm w-full max-w-xs ml-4 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <table className="table w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 text-white text-center">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IdXe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Xe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại Xe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá Xe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Màu Sắc
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Động Cơ
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình Ảnh
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Năm SX
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-sm text-center">
                  <span className="text-gray-500">Đang tải...</span>
                </td>
              </tr>
            ) : isXeTable.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-sm text-center">
                  <span className="text-gray-500">Không có dữ liệu xe</span>
                </td>
              </tr>
            ) : (
              isXeTable.map((xetable, index) => (
                <tr
                  key={xetable.idXe}
                  className={`text-gray-800 text-center hover:bg-gray-50 border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <th className="px-4 py-3 font-medium">{xetable.idXe}</th>
                  <td className="px-4 py-3">{xetable.TenXe}</td>
                  <td className="px-4 py-3">{xetable.idLoaiXe}</td>
                  <td className="px-4 py-3 font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(xetable.GiaXe)}
                  </td>
                  <td className="px-4 py-3">{xetable.MauSac}</td>
                  <td className="px-4 py-3">{xetable.DongCo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`py-1 px-3 rounded-full text-sm ${getStatusColor(xetable.TrangThai)}`}
                    >
                      {xetable.TrangThai}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {xetable.HinhAnh && (
                      <img
                        src={
                          Array.isArray(xetable.HinhAnh)
                            ? xetable.HinhAnh[0]
                            : xetable.HinhAnh.split("|")[0]
                        }
                        alt={xetable.TenXe}
                        width="50"
                        className="mx-auto rounded-md object-cover border border-gray-200"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">{xetable.NamSanXuat}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors shadow-sm font-medium text-xs"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors shadow-sm font-medium text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginationMeta && (
        <div className="flex justify-end space-x-2 mt-4">
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
            >
              Trước
            </button>

            {[...Array(paginationMeta.totalPage)].map((_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 rounded shadow-sm text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === paginationMeta.totalPage}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCarDashboard;
