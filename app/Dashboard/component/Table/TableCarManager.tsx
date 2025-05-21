import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImportExportCar from "../ImportExportCar";

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
  reloadKey: number;
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
  reloadKey,
}) => {
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

  // Selection states
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `api/pagination/vehiclemanagementpagination?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        // Sort the data by idXe in ascending order
        const sortedData = [...(data.data || [])].sort(
          (a, b) => a.idXe - b.idXe
        );
        setXeTable(sortedData);
        setPaginationMeta(data.meta);
        setLoading(false);

        // Reset selections when data changes
        setSelectedCars([]);
        setSelectAll(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setXeTable([]);
        setLoading(false);
      });
  }, [currentPage, pageSize, reloadKey, searchText]);

  useEffect(() => {
    fetch("api/typecar")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLoaiXeTable(data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoaiXeTable([]);
      });
  }, []);

  const getLoaiXeName = (idLoaiXe: number) => {
    const loaiXe = isLoaiXeTable.find((loai) => loai.idLoaiXe === idLoaiXe);
    return loaiXe ? loaiXe.TenLoai : "N/A";
  };

  useEffect(() => {
    fetch("api/suppliers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setNhaCungCap(data || []);
      })
      .catch((error) => {
        console.error("Error:", error);
        setNhaCungCap([]);
      });
  }, []);

  const getNhaCungCapName = (idNhaCungCap: number) => {
    const nhaCungCap = isNhaCungCap.find(
      (nhaCungCap) => nhaCungCap.idNhaCungCap === idNhaCungCap
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
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Màu sắc cho trạng thái
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

  // Truncate long text for better table display
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Handle car selection
  const toggleCarSelection = (idXe: number) => {
    setSelectedCars((prevSelected) => {
      if (prevSelected.includes(idXe)) {
        return prevSelected.filter((id) => id !== idXe);
      } else {
        return [...prevSelected, idXe];
      }
    });
  };

  // Handle select all on current page
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCars([]);
    } else {
      const currentPageIds = isXeTable.map((car) => car.idXe);
      setSelectedCars(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Effect to update selectAll state when selections change
  useEffect(() => {
    // If all cars on the current page are selected
    if (isXeTable.length > 0 && selectedCars.length === isXeTable.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedCars, isXeTable]);

  return (
    <div className="w-full overflow-x-auto pt-2 p-10">
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
          <ImportExportCar
            selectedCars={selectedCars}
            setSelectedCars={setSelectedCars}
            allCars={isXeTable}
          />
        </div>
      </div>

      {/* Table container with fixed layout and controlled width */}
      <div className="relative shadow-md rounded-lg border w-full border-gray-200">
        <div className="overflow-x-auto w-full">
          <table className="table text-center table-auto w-full min-w-[400px]">
            <thead className="bg-gray-50">
              <tr className="text-white text-center">
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                >
                  IdXe
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                >
                  Tên Xe
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                >
                  Loại Xe
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                >
                  Giá Xe
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Màu Sắc
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Động Cơ
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                >
                  Trạng Thái
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                >
                  Nhà Cung Cấp
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36"
                >
                  Thông Số KT
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36"
                >
                  Mô Tả
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Hình Ảnh
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                >
                  Năm SX
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={14} className="p-4 text-sm text-center">
                    <span className="text-gray-500">Đang tải...</span>
                  </td>
                </tr>
              ) : !isXeTable || isXeTable.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-4 text-sm text-center">
                    <span className="text-gray-500">Không có dữ liệu xe</span>
                  </td>
                </tr>
              ) : (
                isXeTable.map((xetable, index) => (
                  <tr
                    key={xetable.idXe}
                    className={`text-gray-800 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${selectedCars.includes(xetable.idXe) ? "bg-blue-50" : ""}`}
                  >
                    <td className="p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(xetable.idXe)}
                        onChange={() => toggleCarSelection(xetable.idXe)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium truncate">
                      {xetable.idXe}
                    </td>
                    <td className="p-3 text-sm truncate">{xetable.TenXe}</td>
                    <td className="p-3 text-sm truncate">
                      {getLoaiXeName(xetable.idLoaiXe)}
                    </td>
                    <td className="p-3 text-sm font-medium truncate">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(xetable.GiaXe)}
                    </td>
                    <td className="p-3 text-sm truncate">{xetable.MauSac}</td>
                    <td className="p-3 text-sm truncate">{xetable.DongCo}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`py-1 px-3 rounded-full text-xs inline-block ${getStatusColor(
                          xetable.TrangThai
                        )}`}
                      >
                        {xetable.TrangThai}
                      </span>
                    </td>
                    <td className="p-3 text-sm truncate">
                      {getNhaCungCapName(xetable.idNhaCungCap)}
                    </td>
                    <td
                      className="p-3 text-sm truncate"
                      title={xetable.ThongSoKyThuat}
                    >
                      {truncateText(xetable.ThongSoKyThuat, 30)}
                    </td>
                    <td className="p-3 text-sm truncate" title={xetable.MoTa}>
                      {truncateText(xetable.MoTa, 30)}
                    </td>
                    <td className="p-3 text-sm">
                      {xetable.HinhAnh && (
                        <img
                          src={
                            Array.isArray(xetable.HinhAnh)
                              ? xetable.HinhAnh[0]
                              : xetable.HinhAnh.split("|")[0]
                          }
                          alt={xetable.TenXe}
                          width="50"
                          className="rounded-md object-cover border border-gray-200"
                        />
                      )}
                    </td>
                    <td className="p-3 text-sm truncate">
                      {xetable.NamSanXuat}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <div
                          onClick={() => onEdit(xetable)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          🖊️
                        </div>
                        <div
                          onClick={() => onDelete(xetable.idXe)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          ❌
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection info */}
      {selectedCars.length > 0 && (
        <div className="mt-4 p-2 bg-blue-50 rounded-lg border border-blue-100 text-sm flex justify-between items-center">
          <div>
            <span className="font-medium">{selectedCars.length}</span> xe đã
            được chọn
          </div>
          <button
            onClick={() => setSelectedCars([])}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            Bỏ chọn tất cả
          </button>
        </div>
      )}

      {/* Pagination */}
      {paginationMeta && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex items-center justify-end min-w-max">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
            >
              Trước
            </button>

            <div className="flex overflow-x-auto px-1 mx-1 gap-1">
              {[...Array(paginationMeta.totalPage)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded shadow-sm text-sm font-medium min-w-8 ${
                    currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
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
