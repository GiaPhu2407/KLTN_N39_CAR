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
    <div className="flex flex-col w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between pb-5 gap-4">
          <div className="mt-2 md:mt-6 ml-4 md:ml-20">
            <label htmlFor="pageSize" className="text-sm">
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 ml-2"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mx-4 md:mx-0">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered h-10 text-sm w-full md:w-72 max-w-xs"
            />

            {/* Import/Export component */}
            <ImportExportSuppliers onImportSuccess={handleImportSuccess} />
          </div>
        </div>

        <div className="w-full overflow-x-auto px-4 md:px-10">
          <table className="table text-center table-auto w-full min-w-[640px]">
            <thead className="text-center">
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Id Nhà Cung Cấp
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tên Nhà Cung Cấp
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Số Điện Thoại
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm text-center">
                    <span>Đang tải...</span>
                  </td>
                </tr>
              ) : !isNhaCungCapTable || isNhaCungCapTable.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm text-center">
                    Không có dữ liệu nhà cung cấp
                  </td>
                </tr>
              ) : (
                isNhaCungCapTable.map((nhacungcap, index) => (
                  <tr
                    key={nhacungcap.idNhaCungCap}
                    className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-3 py-3">{nhacungcap.idNhaCungCap}</td>
                    <td className="px-3 py-3">{nhacungcap.TenNhaCungCap}</td>
                    <td className="px-3 py-3">{nhacungcap.Sdt}</td>
                    <td className="px-3 py-3">{nhacungcap.Email}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-3 justify-center">
                        <button
                          type="button"
                          onClick={() => onEdit(nhacungcap)}
                          className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                        >
                          🖊️
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(nhacungcap.idNhaCungCap)}
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

export default TableSuppliesManager;
