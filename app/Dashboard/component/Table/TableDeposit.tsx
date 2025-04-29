import { useEffect, useState } from "react";
import moment from "moment";

interface DatCoc {
  idDatCoc: number;
  idXe: number;
  idKhachHang: number;
  SotienDat: number;
  NgayDat: string;
  TrangThaiDat: string;
  khachHang?: {
    Hoten: string;
    Email: string;
    Sdt: string;
  };
  xe?: {
    TenXe: string;
    HinhAnh: string;
    GiaXe: number;
  };
  LichHenLayXe?: Array<{
    NgayLayXe: string;
    GioHenLayXe: string;
    DiaDiem: string;
  }>;
}

interface TableDashboardProps {
  onEdit: (product: DatCoc) => void;
  onDelete: (id: number) => void;
  reloadKey: (id: number) => void;
}

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableDatCoc: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isDatCocTable, setDatCocTable] = useState<DatCoc[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Dữ liệu giả
    const fakeData: DatCoc[] = [
      {
        idDatCoc: 1,
        idXe: 1,
        idKhachHang: 1,
        SotienDat: 20000000,
        NgayDat: "2023-04-15T10:00:00",
        TrangThaiDat: "Đã Đặt Cọc",
        khachHang: {
          Hoten: "Nguyễn Văn A",
          Email: "nguyenvana@example.com",
          Sdt: "0912345678",
        },
        xe: {
          TenXe: "Toyota Camry 2023",
          HinhAnh: "/images/toyota_camry.jpg",
          GiaXe: 100000000,
        },
        LichHenLayXe: [
          {
            NgayLayXe: "2023-04-20",
            GioHenLayXe: "09:00",
            DiaDiem: "Showroom",
          },
        ],
      },
      {
        idDatCoc: 2,
        idXe: 2,
        idKhachHang: 2,
        SotienDat: 15000000,
        NgayDat: "2023-04-17T11:00:00",
        TrangThaiDat: "Chờ xác nhận",
        khachHang: {
          Hoten: "Trần Thị B",
          Email: "tranthib@example.com",
          Sdt: "0912345679",
        },
        xe: {
          TenXe: "Honda CR-V 2023",
          HinhAnh: "/images/honda_crv.jpg",
          GiaXe: 120000000,
        },
        LichHenLayXe: [
          {
            NgayLayXe: "2023-04-22",
            GioHenLayXe: "14:00",
            DiaDiem: "Tại nhà",
          },
        ],
      },
      {
        idDatCoc: 3,
        idXe: 3,
        idKhachHang: 3,
        SotienDat: 25000000,
        NgayDat: "2023-04-18T12:00:00",
        TrangThaiDat: "Đã xác nhận",
        khachHang: {
          Hoten: "Lê Hoàng C",
          Email: "lehoangc@example.com",
          Sdt: "0912345680",
        },
        xe: {
          TenXe: "Mazda 3 2023",
          HinhAnh: "/images/mazda_3.jpg",
          GiaXe: 95000000,
        },
        LichHenLayXe: [
          {
            NgayLayXe: "2023-04-25",
            GioHenLayXe: "16:00",
            DiaDiem: "Showroom",
          },
        ],
      },
    ];

    setDatCocTable(fakeData);
    setPaginationMeta({
      totalRecords: fakeData.length,
      totalPage: Math.ceil(fakeData.length / pageSize),
      page: currentPage,
      limit_size: pageSize,
      skip: 0,
    });
    setLoading(false);
  }, [currentPage, pageSize, reloadKey]);

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

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-amber-400 text-gray-800";
      case "Đã xác nhận":
        return "bg-blue-600 text-white";
      case "Đang giao":
        return "bg-orange-500 text-white";
      case "Đã giao":
        return "bg-emerald-500 text-white";
      case "Còn Hàng":
        return "bg-teal-500 text-white";
      case "Hết Hàng":
        return "bg-rose-500 text-white";
      case "Đã hủy":
        return "bg-gray-500 text-white";
      case "Đã đặt hàng":
        return "bg-indigo-500 text-white";
      case "Đã Đặt Cọc":
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between pb-5 gap-4">
          <div className="mt-2 md:mt-6 ml-4 md:ml-20">
            <label htmlFor="pageSize" className="text-sm font-medium">
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <div className="w-full overflow-x-auto px-4 md:px-10">
          <table className="table text-center table-auto w-full min-w-[640px]">
            <thead className="text-center">
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                ID
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Khách Hàng
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                SĐT
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Xe
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Giá Xe
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Trạng Thái
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Số Tiền Đặt
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Ngày Đặt
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Ngày Hẹn
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Địa Điểm
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Thao Tác
              </th>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                isDatCocTable.map((donhang, index) => (
                  <tr
                    key={donhang.idDatCoc}
                    className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-3 py-3">{donhang.idDatCoc}</td>
                    <td className="px-3 py-3">
                      {donhang.khachHang?.Hoten || "Chưa xác định"}
                    </td>
                    <td className="px-3 py-3">
                      {donhang.khachHang?.Sdt || "N/A"}
                    </td>
                    <td className="px-3 py-3">
                      {donhang.xe?.TenXe || "Chưa chọn"}
                    </td>
                    <td className="px-3 py-3">
                      {formatCurrency(donhang.xe?.GiaXe || 0)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-3 py-1 rounded-full ${getStatusColor(donhang.TrangThaiDat)}`}
                      >
                        {donhang.TrangThaiDat}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {formatCurrency(donhang.SotienDat)}
                    </td>
                    <td className="px-3 py-3">
                      {formatDateTime(donhang.NgayDat)}
                    </td>
                    <td className="px-3 py-3">
                      {formatDateTime(donhang.LichHenLayXe?.[0]?.NgayLayXe)}
                    </td>
                    <td className="px-3 py-3">
                      {donhang.LichHenLayXe?.[0]?.DiaDiem || "Chưa xác định"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(donhang)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          🖊️
                        </button>
                        <button
                          onClick={() => onDelete(donhang.idDatCoc)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {paginationMeta && (
        <div className="flex justify-end space-x-2 mt-4 px-4 md:px-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
            >
              Trước
            </button>

            {[...Array(paginationMeta.totalPage)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationMeta.totalPage}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDatCoc;
