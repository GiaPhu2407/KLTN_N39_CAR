// 1. Thêm useCallback và state mới cho việc reload dữ liệu
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import ImportExportSuppliers from "../ImportExportSuppliers";

interface Nhacungcap {
  idNhaCungCap: number;
  TenNhaCungCap: string;
  Sdt: number;
  Email: string;
}

interface TableSuppliesManagerProps {
  onEdit: (supplier: Nhacungcap) => void;
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

const TableSuppliesManager: React.FC<TableSuppliesManagerProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isNhaCungCapTable, setNhaCungCapTable] = useState<Nhacungcap[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [localReloadKey, setLocalReloadKey] = useState(0); // Thêm state này để reload theo yêu cầu

  // 2. Chuyển hàm fetchData sang dùng useCallback để tối ưu
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `api/pagination/suppliesmanagement?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setNhaCungCapTable(data.data || []);
      setPaginationMeta(data.meta);
    } catch (error) {
      console.error("Error:", error);
      setNhaCungCapTable([]);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText]);

  // 3. Cập nhật useEffect để thêm localReloadKey vào dependencies
  useEffect(() => {
    fetchData();
  }, [fetchData, reloadKey, localReloadKey]); // Thêm localReloadKey vào đây

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

  // 4. Thêm hàm xử lý khi import thành công
  const handleImportSuccess = () => {
    setLocalReloadKey((prev) => prev + 1); // Tăng giá trị để kích hoạt useEffect
  };

  return (
    <div className="space-y-1 pl-14">
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
          {/* 5. Truyền callback vào component ImportExportSuppliers */}
          <ImportExportSuppliers onImportSuccess={handleImportSuccess} />
        </div>
      </div>

      {/* Table container with fixed layout and controlled width */}
      <div className="relative shadow-md rounded-lg border border-gray-200 w-full overflow-x-auto">
        <div className="overflow-x-auto w-full">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-white text-center">
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                >
                  Id Nhà Cung Cấp
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-52"
                >
                  Tên Nhà Cung Cấp
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                >
                  Số Điện Thoại
                </th>
                <th
                  scope="col"
                  className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48"
                >
                  Email
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
                  <td colSpan={5} className="p-4 text-sm text-center">
                    <span className="text-gray-500">Đang tải...</span>
                  </td>
                </tr>
              ) : !isNhaCungCapTable || isNhaCungCapTable.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-sm text-center">
                    <span className="text-gray-500">
                      Không có dữ liệu nhà cung cấp
                    </span>
                  </td>
                </tr>
              ) : (
                isNhaCungCapTable.map((nhacungcap, index) => (
                  <tr
                    key={nhacungcap.idNhaCungCap}
                    className={`text-gray-800 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 text-sm font-medium truncate">
                      {nhacungcap.idNhaCungCap}
                    </td>
                    <td className="p-3 text-sm truncate">
                      {nhacungcap.TenNhaCungCap}
                    </td>
                    <td className="p-3 text-sm truncate">{nhacungcap.Sdt}</td>
                    <td className="p-3 text-sm truncate">{nhacungcap.Email}</td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <div
                          onClick={() => onEdit(nhacungcap)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          🖊️
                        </div>
                        <div
                          onClick={() => onDelete(nhacungcap.idNhaCungCap)}
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

      {/* Fixed width pagination with better overflow handling */}
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

export default TableSuppliesManager;
