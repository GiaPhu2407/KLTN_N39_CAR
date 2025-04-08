import React, { useEffect, useState, useContext, useCallback } from "react";
import toast from "react-hot-toast";

import { CarDataContext } from "../CarDataContext";
import ImportExportComponent from "../ImportExportCar";

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
  ThongSoKyThuat: string;
  MoTa: string;
  idNhaCungCap: number;
  nhaCungCap?: {
    TenNhaCungCap: string;
  };
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

interface NhaCungCap {
  idNhaCungCap: number;
  TenNhaCungCap: string;
}

interface TableCarDashboardProps {
  onEdit: (product: Xe) => void;
  onDelete: (id: number) => void;
}

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableCarDashboard: React.FC<TableCarDashboardProps> = ({
  onEdit,
  onDelete,
}) => {
  const { refreshKey, sortOrder } = useContext(CarDataContext);
  const [isXeTable, setXeTable] = useState<Xe[]>([]);
  const [isLoaiXeTable, setLoaiXeTable] = useState<LoaiXe[]>([]);
  const [isNhaCungCap, setNhaCungCap] = useState<NhaCungCap[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `api/pagination/vehiclemanagementpagination?page=${currentPage}&limit_size=${pageSize}&search=${searchText}&sortOrder=${sortOrder}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      const sortedData = [...(data.data || [])].sort((a, b) => {
        if (sortOrder === "asc") {
          return a.idXe - b.idXe;
        } else {
          return b.idXe - a.idXe;
        }
      });

      setXeTable(sortedData);
      setPaginationMeta(data.meta);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi khi tải dữ liệu");
      setXeTable([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, sortOrder]);

  const fetchTypes = useCallback(async () => {
    try {
      const response = await fetch("api/typecar");
      if (!response.ok) throw new Error("Failed to fetch types");
      const data = await response.json();
      setLoaiXeTable(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi khi tải loại xe");
    }
  }, []);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch("api/suppliers");
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      const data = await response.json();
      setNhaCungCap(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi khi tải nhà cung cấp");
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([fetchData(), fetchTypes(), fetchSuppliers()]);
    };
    loadAllData();
  }, [fetchData, fetchTypes, fetchSuppliers, refreshKey]);

  const getLoaiXeName = (idLoaiXe: number) => {
    const loaiXe = isLoaiXeTable.find((loai) => loai.idLoaiXe === idLoaiXe);
    return loaiXe ? loaiXe.TenLoai : "N/A";
  };

  const getNhaCungCapName = (idNhaCungCap: number) => {
    const nhaCungCap = isNhaCungCap.find(
      (ncc) => ncc.idNhaCungCap === idNhaCungCap
    );
    return nhaCungCap ? nhaCungCap.TenNhaCungCap : "N/A";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Đang giao":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Đã giao":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "Còn Hàng":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "Hết Hàng":
        return "bg-red-100 text-red-800 border border-red-300";
      case "Đã hủy":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      case "Đã đặt hàng":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      case "Đã Đặt Cọc":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="w-full overflow-x-auto pt-2 px-10">
      <div className="flex flex-wrap justify-between items-center pb-5 gap-4">
        <div className="flex items-center">
          <label
            htmlFor="pageSize"
            className="text-sm font-medium text-gray-700"
          >
            Số mục mỗi trang:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
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
            className="input border border-gray-300 rounded-lg h-10 text-sm w-full max-w-xs px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <ImportExportComponent />
        </div>
      </div>

      <div className="relative shadow-md rounded-lg border w-full border-gray-200">
        <div className="overflow-x-auto w-full">
          <table className="table text-center table-auto w-full min-w-[400px]">
            <thead className="bg-gray-50">
              <tr className="text-white text-center">
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  IdXe
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Tên Xe
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Loại Xe
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Giá Xe
                </th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Màu Sắc
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Động Cơ
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Trạng Thái
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Nhà Cung Cấp
                </th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Thông Số KT
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Mô Tả
                </th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Hình Ảnh
                </th>
                <th className="p-3  text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Năm SX
                </th>
                <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={13} className="p-4 text-sm text-center">
                    <span className="text-gray-500">Đang tải...</span>
                  </td>
                </tr>
              ) : !isXeTable || isXeTable.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-4 text-sm text-center">
                    <span className="text-gray-500">Không có dữ liệu xe</span>
                  </td>
                </tr>
              ) : (
                isXeTable.map((xetable, index) => (
                  <tr
                    key={xetable.idXe}
                    className={`text-gray-800 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 text-sm font-medium truncate">
                      {xetable.idXe}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {truncateText(xetable.TenXe, 30)}
                    </td>
                    <td className="p-3 text-sm">
                      {xetable.loaiXe
                        ? xetable.loaiXe.TenLoai
                        : getLoaiXeName(xetable.idLoaiXe)}
                    </td>
                    <td className="p-3 text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(xetable.GiaXe)}
                    </td>
                    <td className="p-3 text-sm">{xetable.MauSac}</td>
                    <td className="p-3 text-sm">{xetable.DongCo}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          xetable.TrangThai
                        )}`}
                      >
                        {xetable.TrangThai}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {xetable.nhaCungCap
                        ? xetable.nhaCungCap.TenNhaCungCap
                        : getNhaCungCapName(xetable.idNhaCungCap)}
                    </td>
                    <td className="p-3 text-sm">
                      {truncateText(xetable.ThongSoKyThuat, 40)}
                    </td>
                    <td className="p-3 text-sm">
                      {truncateText(xetable.MoTa, 40)}
                    </td>
                    <td className="p-3 text-sm">
                      {xetable.HinhAnh ? (
                        <div className="w-12 h-12 relative">
                          <img
                            src={xetable.HinhAnh}
                            alt={xetable.TenXe}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-car.png";
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="p-3 text-sm">{xetable.NamSanXuat}</td>
                    <td className="p-3 text-right flex gap-2">
                      <button
                        onClick={() => onEdit(xetable)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm("Bạn có chắc muốn xóa xe này không?")
                          ) {
                            onDelete(xetable.idXe);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paginationMeta && paginationMeta.totalPage > 0 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
          <div className="text-sm text-gray-700">
            Hiển thị {(paginationMeta.page - 1) * paginationMeta.limit_size + 1}{" "}
            đến{" "}
            {Math.min(
              paginationMeta.page * paginationMeta.limit_size,
              paginationMeta.totalRecords
            )}{" "}
            trong tổng số {paginationMeta.totalRecords} mục
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="sr-only">First</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L6.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {paginationMeta &&
              Array.from({ length: paginationMeta.totalPage }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === paginationMeta.totalPage ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-3 py-1">...</span>
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationMeta.totalPage}
              className={`px-3 py-1 rounded ${
                currentPage === paginationMeta.totalPage
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(paginationMeta.totalPage)}
              disabled={currentPage === paginationMeta.totalPage}
              className={`px-3 py-1 rounded ${
                currentPage === paginationMeta.totalPage
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="sr-only">Last</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M9.293 15.707a1 1 0 010-1.414L13.586 10 9.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCarDashboard;
