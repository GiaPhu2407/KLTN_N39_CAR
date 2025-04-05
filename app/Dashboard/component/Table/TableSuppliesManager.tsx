import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import ImportExportComponent from "./ImportExportLoaiXe";

interface Nhacungcap {
  idNhaCungCap: number;
  TenNhaCungCap: string;
  Sdt: number;
  Email: string;
}

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableNhaCungCap: React.FC = ({}) => {
  const [isNhaCungCapTable, setNhaCungCapTable] = useState<Nhacungcap[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchText]);

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
        setNhaCungCapTable(data.data);
        setPaginationMeta(data.meta);
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
              <button className="btn text-xs btn-success">Excel</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto ml-20">
          <table className="table w-[1000px]">
            <thead>
              <tr className="bg-gray-50 text-white text-center">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Id Nhà Cung Cấp{" "}
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tên Nhà Cung Cấp
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Số Điện Thoại
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
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
              ) : isNhaCungCapTable.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm text-center">
                    Không có dữ liệu loại xe
                  </td>
                </tr>
              ) : (
                isNhaCungCapTable.map((nhacungcap) => (
                  <tr
                    key={nhacungcap.idNhaCungCap}
                    className="text-black text-center"
                  >
                    <th>{nhacungcap.idNhaCungCap}</th>
                    <td>{nhacungcap.TenNhaCungCap}</td>
                    <td>{nhacungcap.Sdt}</td>
                    <td>{nhacungcap.Email}</td>
                    <td className="space-x-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Sửa
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
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

export default TableNhaCungCap;
