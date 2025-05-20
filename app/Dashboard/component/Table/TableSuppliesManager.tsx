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
  const [localReloadKey, setLocalReloadKey] = useState(0);

  // Add states for selection functionality
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  useEffect(() => {
    fetchData();
    // Reset selection when data refreshes
    setSelectedItems([]);
    setSelectAll(false);
  }, [fetchData, reloadKey, localReloadKey]);

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

  const handleImportSuccess = () => {
    setLocalReloadKey((prev) => prev + 1);
  };

  // Handle item selection toggle
  const toggleSelectItem = (idNhaCungCap: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(idNhaCungCap)) {
        return prevSelected.filter((id) => id !== idNhaCungCap);
      } else {
        return [...prevSelected, idNhaCungCap];
      }
    });
  };

  // Handle select all toggle
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        isNhaCungCapTable.map((supplier) => supplier.idNhaCungCap)
      );
    }
    setSelectAll(!selectAll);
  };

  // Check if an item is selected
  const isItemSelected = (idNhaCungCap: number) => {
    return selectedItems.includes(idNhaCungCap);
  };

  // Handle delete single supplier with confirmation
  const handleDeleteSingle = (idNhaCungCap: number) => {
    const supplier = isNhaCungCapTable.find(
      (s) => s.idNhaCungCap === idNhaCungCap
    );
    const supplierName = supplier
      ? supplier.TenNhaCungCap
      : `ID ${idNhaCungCap}`;

    // Define a unique ID for our confirmation toast
    const confirmationToastId = `delete-single-confirmation-${idNhaCungCap}`;

    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa nhà cung cấp "{supplierName}" không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                // First dismiss the confirmation toast
                toast.dismiss(t.id);

                try {
                  // Show a loading toast while deleting
                  const loadingToastId = toast.loading(
                    "Đang xóa nhà cung cấp..."
                  );

                  const response = await fetch(
                    `api/suppliers/${idNhaCungCap}`,
                    {
                      method: "DELETE",
                    }
                  );

                  // Dismiss the loading toast
                  toast.dismiss(loadingToastId);

                  if (!response.ok) {
                    throw new Error(
                      `Failed to delete supplier with ID ${idNhaCungCap}`
                    );
                  }

                  // Show success toast
                  toast.success(
                    `Đã xóa nhà cung cấp "${supplierName}" thành công`
                  );

                  // Trigger a refetch of data
                  setLocalReloadKey((prev) => prev + 1);
                } catch (error) {
                  console.error("Error deleting supplier:", error);
                  toast.error("Đã xảy ra lỗi khi xóa nhà cung cấp");
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
        id: confirmationToastId,
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

  // Handle delete all selected suppliers
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("Không có nhà cung cấp nào được chọn để xóa");
      return;
    }

    // Define a unique ID for our confirmation toast
    const confirmationToastId = "delete-suppliers-confirmation-toast";

    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa {selectedItems.length} nhà cung cấp đã
            chọn không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                // First dismiss the confirmation toast
                toast.dismiss(t.id);

                try {
                  // Show a loading toast while deleting
                  const loadingToastId = toast.loading(
                    "Đang xóa nhà cung cấp..."
                  );

                  // Create an array of promises for each delete request
                  const deletePromises = selectedItems.map((idNhaCungCap) =>
                    fetch(`api/suppliers/${idNhaCungCap}`, {
                      method: "DELETE",
                    }).then((res) => {
                      if (!res.ok)
                        throw new Error(
                          `Failed to delete supplier with ID ${idNhaCungCap}`
                        );
                      return res.json();
                    })
                  );

                  // Wait for all delete operations to complete
                  await Promise.all(deletePromises);

                  // Dismiss the loading toast
                  toast.dismiss(loadingToastId);

                  // Show the success toast
                  toast.success(
                    `Đã xóa ${selectedItems.length} nhà cung cấp thành công`
                  );

                  // Reset selections and trigger reload
                  setSelectedItems([]);
                  setSelectAll(false);
                  setLocalReloadKey((prev) => prev + 1);
                } catch (error) {
                  console.error("Error deleting selected suppliers:", error);
                  toast.error("Đã xảy ra lỗi khi xóa các nhà cung cấp đã chọn");
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
        id: confirmationToastId,
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

            <ImportExportSuppliers onImportSuccess={handleImportSuccess} />

            {/* Add delete selected button */}
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 h-10 rounded text-sm font-medium transition-colors flex items-center"
              >
                <span className="mr-1">Xóa</span>
                <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  {selectedItems.length}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto px-4 md:px-10">
          <table className="table text-center table-auto w-full min-w-[640px]">
            <thead className="text-center">
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="checkbox checkbox-sm bg-white"
                    />
                    <span className="pl-1">All</span>
                  </div>
                </th>
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
                  <td colSpan={6} className="px-3 py-4 text-sm text-center">
                    <span>Đang tải...</span>
                  </td>
                </tr>
              ) : !isNhaCungCapTable || isNhaCungCapTable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-sm text-center">
                    Không có dữ liệu nhà cung cấp
                  </td>
                </tr>
              ) : (
                isNhaCungCapTable.map((nhacungcap, index) => (
                  <tr
                    key={nhacungcap.idNhaCungCap}
                    className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                      isItemSelected(nhacungcap.idNhaCungCap)
                        ? "bg-indigo-50"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={isItemSelected(nhacungcap.idNhaCungCap)}
                        onChange={() =>
                          toggleSelectItem(nhacungcap.idNhaCungCap)
                        }
                        className="checkbox checkbox-sm bg-white"
                      />
                    </td>
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
                          onClick={() =>
                            handleDeleteSingle(nhacungcap.idNhaCungCap)
                          }
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
