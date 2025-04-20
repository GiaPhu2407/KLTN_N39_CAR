import React, { useEffect, useState } from "react";

interface DanhGiaTraiNghiem {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number | null;
  NoiDung: string | null;
  NgayDanhGia: string;
  lichHen: {
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
    <div className="space-y-1 pl-14">
      <div className="overflow-x-auto">
        <div className="flex justify-between pb-5">
          <div className="mt-6">
            <label htmlFor="pageSize" className="text-sm">
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
          <div className="flex pr-7 items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered w-full h-10 text-sm max-w-xs"
            />
            {/* You can add an ImportExportComponent here if needed */}
          </div>
        </div>
        <div className="relative shadow-md rounded-lg border border-gray-200 w-full overflow-x-auto">
          <div className="overflow-x-auto w-full">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-white text-center">
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
                  >
                    ID ĐÁNH GIÁ
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-70"
                  >
                    TÊN KHÁCH HÀNG
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
                  >
                    Xe
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
                  >
                    Đánh Giá
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
                  >
                    Nội Dung
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-52"
                  >
                    Ngày Đánh Giá
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-black py-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : danhGiaList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-black py-4">
                      Không có dữ liệu đánh giá
                    </td>
                  </tr>
                ) : (
                  danhGiaList.map((danhGia) => (
                    <tr
                      key={danhGia.idDanhGia}
                      className="text-black text-center"
                    >
                      <th>{danhGia.idDanhGia}</th>
                      <td>
                        {danhGia.lichHen?.TenKhachHang || "N/A"}
                        <div className="text-xs text-gray-500">
                          {danhGia.lichHen?.Sdt || ""}
                        </div>
                      </td>
                      <td>{danhGia.xe?.TenXe || "N/A"}</td>
                      <td>{renderStarRating(danhGia.SoSao)}</td>
                      <td className="max-w-xs truncate">
                        {danhGia.NoiDung || "Không có nội dung"}
                      </td>
                      <td>{formatDate(danhGia.NgayDanhGia)}</td>
                      <td className="space-x-2">
                        <button
                          type="button"
                          onClick={() => onEdit(danhGia)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          🖊️
                        </button>
                        <button
                          onClick={() => onDelete(danhGia.idDanhGia)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {paginationMeta && (
        <div className="flex justify-end space-x-2 mt-4">
          <div className="flex space-x-3">
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

export default TableDanhGiaTraiNghiem;
