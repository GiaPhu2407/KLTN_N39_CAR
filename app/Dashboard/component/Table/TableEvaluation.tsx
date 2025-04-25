import React, { useEffect, useState } from "react";

interface DanhGiaTraiNghiem {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number | null;
  NoiDung: string | null;
  NgayDanhGia: string;
  lichHenTraiNghiem: {
    TenKhachHang: string | null;
    Sdt: string | null;
    Email: string | null;
  };
  xe: {
    TenXe: string | null;
    GiaXe: number | null;
  };
}

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
}

interface TableDanhGiaTraiNghiemProps {
  onEdit: (danhGia: DanhGiaTraiNghiem) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableDanhGiaTraiNghiem: React.FC<TableDanhGiaTraiNghiemProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [danhGiaList, setDanhGiaList] = useState<DanhGiaTraiNghiem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchDanhGiaData();
  }, [currentPage, pageSize, reloadKey, searchText]);

  const fetchDanhGiaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `api/pagination/evaluate?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setDanhGiaList(data.data);
      setPaginationMeta(data.meta);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
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

  // Function to render star rating
  const renderStarRating = (rating: number | null) => {
    if (!rating) return "Chưa đánh giá";

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return <div className="flex justify-center">{stars}</div>;
  };

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

      <div className="flex items-center gap-4 mx-4 md:mx-0 md:pr-7">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered h-10 text-sm w-full md:w-72 max-w-xs"
        />
        {/* You can add an ImportExportComponent here if needed */}
      </div>
    </div>

    <div className="w-full overflow-x-auto px-4 md:px-10">
      <table className="table text-center table-auto w-full min-w-[800px]">
        <thead className="text-center">
          <tr className="bg-gray-50">
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              ID ĐÁNH GIÁ
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              TÊN KHÁCH HÀNG
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Xe
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Đánh Giá
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Nội Dung
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Ngày Đánh Giá
            </th>
            <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-sm text-center">
                <span>Đang tải...</span>
              </td>
            </tr>
          ) : danhGiaList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-sm text-center">
                Không có dữ liệu đánh giá
              </td>
            </tr>
          ) : (
            danhGiaList.map((danhGia, index) => (
              <tr key={danhGia.idDanhGia} className={`text-black text-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-2 py-3">{danhGia.idDanhGia}</td>
                <td className="px-2 py-3">
                  {danhGia.lichHenTraiNghiem?.TenKhachHang || "N/A"}
                  <div className="text-xs text-gray-500">
                    {danhGia.lichHenTraiNghiem?.Sdt || ""}
                  </div>
                </td>
                <td className="px-2 py-3">{danhGia.xe?.TenXe || "N/A"}</td>
                <td className="px-2 py-3">
                  <div className="flex justify-center">
                    {renderStarRating(danhGia.SoSao)}
                  </div>
                </td>
                <td className="px-2 py-3 max-w-xs truncate">
                  {danhGia.NoiDung || "Không có nội dung"}
                </td>
                <td className="px-2 py-3">{formatDate(danhGia.NgayDanhGia)}</td>
                <td className="px-2 py-3">
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => onEdit(danhGia)}
                      className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                    >
                      👁️
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(danhGia.idDanhGia)}
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

export default TableDanhGiaTraiNghiem;
