import { useEffect, useState } from "react";

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

interface TableDepositProps {
  onEdit: (deposit: DatCoc) => void;
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

const TableDeposit: React.FC<TableDepositProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [deposits, setDeposits] = useState<DatCoc[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(
      `api/pagination/deposit?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setDeposits(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [currentPage, pageSize, reloadKey, searchText]);

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
          <div className="flex items-center mt-2 md:mt-6 ml-4 md:ml-20">
            <label htmlFor="pageSize" className="text-sm font-medium mr-2">
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

          <div className="flex items-center mr-4 md:mr-20">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 rounded-lg h-10 text-sm w-full max-w-xs px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto  md:px-10">
          <table className="table text-center table-auto w-full min-w-[740px]">
            <thead className="text-center">
              <tr>
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
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide w-36">
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                deposits.map((deposit, index) => (
                  <tr
                    key={deposit.idDatCoc}
                    className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-3 py-3">{deposit.idDatCoc}</td>
                    <td className="px-3 py-3">
                      {deposit.khachHang?.Hoten || "Chưa xác định"}
                    </td>
                    <td className="px-3 py-3">
                      {deposit.khachHang?.Sdt || "N/A"}
                    </td>
                    <td className="px-3 py-3">
                      {deposit.xe?.TenXe || "Chưa chọn"}
                    </td>
                    <td className="px-3 py-3">
                      {formatCurrency(deposit.xe?.GiaXe || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 w-full text-center py-1 rounded-full ${getStatusColor(deposit.TrangThaiDat)} whitespace-nowrap`}
                      >
                        {deposit.TrangThaiDat}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      {formatCurrency(deposit.SotienDat)}
                    </td>
                    <td className="px-3 py-3">
                      {formatDateTime(deposit.NgayDat)}
                    </td>
                    <td className="px-3 py-3">
                      {formatDateTime(deposit.LichHenLayXe?.[0]?.NgayLayXe)}
                    </td>
                    <td className="px-3 py-3">
                      {deposit.LichHenLayXe?.[0]?.DiaDiem || "Chưa xác định"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEdit(deposit)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          🖊️
                        </button>
                        <button
                          onClick={() => onDelete(deposit.idDatCoc)}
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

export default TableDeposit;
