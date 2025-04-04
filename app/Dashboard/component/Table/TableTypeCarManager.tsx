import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import ImportExportComponent from "./ImportExportLoaiXe";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string;
}

interface TableLoaiXeProps {
  onEdit: (loaixe: LoaiXe) => void;
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

const TableLoaiXe: React.FC<TableLoaiXeProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isLoaiXeTable, setLoaiXeTable] = useState<LoaiXe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, reloadKey, searchText]);

  const fetchData = () => {
    setLoading(true);
    fetch(
      `api/phantrang/phantrangloaixe?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setLoaiXeTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Không thể tải dữ liệu loại xe");
        setLoading(false);
      });
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

  const handleEditClick = (loaixe: LoaiXe) => {
    onEdit(loaixe);
  };

  const handleDeleteClick = (id: number) => {
    onDelete(id);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between pb-5 gap-4">
          <div className="mt-6 ml-20">
            <label htmlFor="pageSize" className="text-sm">
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1"
            >
              <option value="5">5 </option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className=" flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mr-48 input input-bordered h-10 text-sm w-72 max-w-xs"
            />

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button className="btn text-xs btn-accent">Import File</button>

              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn text-xs btn-primary">
                  Export
                </button>
              </div>
              <select id="pageSize" className="border rounded px-2 py-1">
                <option value="Word">Word </option>
                <option value="Excel">Excel</option>
                <option value="PDF">PDF</option>
              </select>
              <button className="btn text-xs btn-success">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto ml-20">
          <table className="table w-[1000px]">
            <thead>
              <tr className="bg-gray-50 text-white text-center">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Id Loại Xe
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tên Loại Xe
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Nhãn Hiệu
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Hình Ảnh
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
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
              ) : isLoaiXeTable.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm text-center">
                    Không có dữ liệu loại xe
                  </td>
                </tr>
              ) : (
                isLoaiXeTable.map((loaixe) => (
                  <tr key={loaixe.idLoaiXe} className="text-black text-center">
                    <th>{loaixe.idLoaiXe}</th>
                    <td>{loaixe.TenLoai}</td>
                    <td>{loaixe.NhanHieu}</td>
                    <td>
                      {loaixe.HinhAnh && (
                        <img
                          src={
                            Array.isArray(loaixe.HinhAnh)
                              ? loaixe.HinhAnh[0]
                              : loaixe.HinhAnh.split("|")[0]
                          }
                          alt={loaixe.TenLoai}
                          width="50"
                        />
                      )}
                    </td>
                    <td className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => handleEditClick(loaixe)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(loaixe.idLoaiXe)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paginationMeta && (
        <div className="flex justify-end space-x-2 mt-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
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
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableLoaiXe;
