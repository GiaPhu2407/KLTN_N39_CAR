import { useEffect, useState } from "react";
import ReportDatCocComponent from "../Reportdeposit";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

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
  // Add state for checkbox selection
  const [selectedDeposits, setSelectedDeposits] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  // Handle individual checkbox selection
  const handleCheckboxChange = (depositId: number) => {
    setSelectedDeposits(prev => {
      if (prev.includes(depositId)) {
        return prev.filter(id => id !== depositId);
      }
      return [...prev, depositId];
    });
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      // If select all is true, select all deposits in the current page
      const allDepositIds = deposits.map(deposit => deposit.idDatCoc);
      setSelectedDeposits(allDepositIds);
    } else {
      // If select all is false, clear all selections
      setSelectedDeposits([]);
    }
  };

  // Effect to update selectAll state when selectedDeposits changes
  useEffect(() => {
    // Check if all deposits on current page are selected
    if (deposits.length > 0) {
      const allSelected = deposits.every(deposit => 
        selectedDeposits.includes(deposit.idDatCoc)
      );
      setSelectAll(allSelected);
    }
  }, [selectedDeposits, deposits]);

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

  // Handle delete single deposit with confirmation
  const handleDeleteSingle = (idDatCoc: number) => {
    const deposit = deposits.find(d => d.idDatCoc === idDatCoc);
    const customerName = deposit?.khachHang?.Hoten || `ID ${idDatCoc}`;
    
    // Define a unique ID for our confirmation toast
    const confirmationToastId = `delete-single-confirmation-${idDatCoc}`;
    
    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);
    
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa đặt cọc của "{customerName}" không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                // First dismiss the confirmation toast
                toast.dismiss(t.id);
                
                try {
                  // Show a loading toast while deleting
                  const loadingToastId = toast.loading("Đang xóa đặt cọc...");
                  
                  // Call the backend API to delete the deposit
                  // This is an example, replace with your actual API endpoint
                  const response = await fetch(`api/deposit/${idDatCoc}`, {
                    method: "DELETE",
                  });
                  
                  // Dismiss the loading toast
                  toast.dismiss(loadingToastId);
                  
                  if (!response.ok) {
                    throw new Error(`Failed to delete deposit with ID ${idDatCoc}`);
                  }
                  
                  // Show success toast
                  toast.success(`Đã xóa đặt cọc của "${customerName}" thành công`);
                  
                  // Call the parent component's onDelete callback
                  onDelete(idDatCoc);
                } catch (error) {
                  console.error("Error deleting deposit:", error);
                  toast.error("Đã xảy ra lỗi khi xóa đặt cọc");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        id: confirmationToastId, // Use our custom ID
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
  };

  // Handle delete all selected deposits
  const handleDeleteSelected = () => {
    if (selectedDeposits.length === 0) {
      toast.error("Không có đặt cọc nào được chọn để xóa");
      return;
    }

    // Define a unique ID for our confirmation toast
    const confirmationToastId = "delete-confirmation-toast";
    
    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);
    
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa {selectedDeposits.length} đặt cọc đã chọn không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                // First dismiss the confirmation toast
                toast.dismiss(t.id);
                
                try {
                  // Show a loading toast while deleting
                  const loadingToastId = toast.loading("Đang xóa đặt cọc...");
                  
                  // Create an array of promises for each delete request
                  const deletePromises = selectedDeposits.map(idDatCoc => 
                    fetch(`api/deposit/${idDatCoc}`, {
                      method: "DELETE",
                    }).then(res => {
                      if (!res.ok) throw new Error(`Failed to delete deposit with ID ${idDatCoc}`);
                      return res.json();
                    })
                  );
                  
                  // Wait for all delete operations to complete
                  await Promise.all(deletePromises);
                  
                  // Dismiss the loading toast
                  toast.dismiss(loadingToastId);
                  
                  // Show the success toast
                  toast.success(`Đã xóa ${selectedDeposits.length} đặt cọc thành công`);
                  
                  // Reset selections
                  setSelectedDeposits([]);
                  setSelectAll(false);
                  
                  // Refresh data by calling the API again
                  setLoading(true);
                  const refreshResponse = await fetch(
                    `api/pagination/deposit?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
                  );
                  if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    setDeposits(refreshData.data);
                    setPaginationMeta(refreshData.meta);
                  }
                  setLoading(false);
                } catch (error) {
                  console.error("Error deleting selected deposits:", error);
                  toast.error("Đã xảy ra lỗi khi xóa các đặt cọc đã chọn");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        id: confirmationToastId, // Use our custom ID
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
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
        
        <div className="flex w-full justify-end px-4 md:px-10 pb-3 gap-2">
          {selectedDeposits.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 h-10 rounded text-sm font-medium transition-colors flex items-center"
            >
              <span className="mr-1">Xóa</span>
              <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
                {selectedDeposits.length}
              </span>
            </button>
          )}
          <ReportDatCocComponent selectedDeposits={selectedDeposits} />
        </div>
        
        <div className="w-full overflow-x-auto md:px-10">
          <table className="table text-center table-auto w-full min-w-[740px]">
            <thead className="text-center">
              <tr>
                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm bg-white"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="pl-1">All</span>
                  </div>
                </th>
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
                    className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                      selectedDeposits.includes(deposit.idDatCoc) ? "bg-indigo-50" : ""
                    }`}
                  >
                    <td className="px-2 py-3">
                      <input 
                        type="checkbox"
                        checked={selectedDeposits.includes(deposit.idDatCoc)}
                        onChange={() => handleCheckboxChange(deposit.idDatCoc)}
                        className="checkbox checkbox-sm"
                      />
                    </td>
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
                          onClick={() => handleDeleteSingle(deposit.idDatCoc)}
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