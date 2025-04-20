import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, FileType, FileText } from "lucide-react";
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
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");

  const fetchData = () => {
    setLoading(true);
    console.log("Fetching data with: ", { currentPage, pageSize, searchText });
    fetch(
      `api/pagination/typecar?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        console.log("Data received: ", data);
        setLoaiXeTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      });
  };

  const handleFileImport = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only Excel or CSV files");
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", file.name.endsWith(".csv") ? "csv" : "excel");

    try {
      const response = await fetch("api/typecar/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      toast.success(`Successfully imported ${result.count} records`);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`api/typecar/export?format=${exportFormat}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExtension = exportFormat === "excel" ? "xlsx" : exportFormat;
      a.download = `cars.${fileExtension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("Export successful");
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    }
  };

  const handleReport = async () => {
    try {
      const response = await fetch("api/typecar/report");

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LoaiXe-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("Report generated successfully");
    } catch (error: any) {
      toast.error(`Report generation failed: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, reloadKey, searchText]);

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
    <div className=" w-full">
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
              className="input input-bordered h-10 text-sm w-72 max-w-xs"
            />

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div>
                <label className="inline-flex items-center px-1 py-1 pr-5 btn text-xs btn-accent cursor-pointer transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileImport}
                    disabled={importing}
                  />
                  <Upload className="h-5 w-5 mr-2 ml-2" />
                  <span className="justify-center text-xs">
                    {importing ? "Đang nhập..." : "Nhập File"}
                  </span>
                </label>
              </div>

              <div className="dropdown dropdown-end">
                <button
                  className="btn text-xs btn-primary"
                  onClick={handleExport}
                >
                  <FileType className="h-6 w-5 mr-2" />
                  <span className="">Xuất</span>
                </button>
              </div>
              <select
                className="border rounded px-2 py-1"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
                <option value="doc">Word</option>
              </select>
              <button
                className="btn text-xs btn-success"
                onClick={handleReport}
              >
                <FileText className="h-6 w-5 mr-2 ml-2" />
                <span className="text-xs">Tạo</span>
                <span className="text-xs">Báo Cáo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto pt-2 px-10">
          <table className="table text-center table-auto w-full min-w-[400px] ">
            <thead className="text-center">
              <tr className="bg-gray-50 text-white">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ID
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tên Loại Xe
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Nhãn Hiệu
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Hình Ảnh
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
                          className="text-center"
                        />
                      )}
                    </td>
                    <td className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => handleEditClick(loaixe)}
                        className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
                      >
                        🖊️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(loaixe.idLoaiXe)}
                        className="px-3 py-1 text-white rounded transition-colors cursor-pointer font-medium text-xs"
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
