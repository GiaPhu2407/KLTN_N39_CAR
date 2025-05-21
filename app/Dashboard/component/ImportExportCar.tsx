import React, { useState, useContext, useEffect } from "react";
import { Upload, FileType, FileText, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { CarDataContext } from "./CarDataContext";

interface ImportExportComponentProps {
  selectedCars: any; // Replace 'Car' with your actual car type
  setSelectedCars: any; // Proper typing for a state setter
  allCars: any;
}

// Use the interface to type your component
const ImportExportComponent: React.FC<ImportExportComponentProps> = ({
  selectedCars,
  setSelectedCars,
  allCars,
}) => {
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [exportLoading, setExportLoading] = useState(false);
  const { refreshData } = useContext(CarDataContext);

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Vui lòng chỉ tải lên file Excel hoặc CSV");
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", file.name.endsWith(".csv") ? "csv" : "excel");

    try {
      const response = await fetch("api/car/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Duplicate car names found") {
          toast.error("Phát hiện tên xe trùng lặp trong file import");
          if (data.duplicateNames?.length > 0) {
            data.duplicateNames.forEach((name: string) => {
              toast.error(`Tên xe trùng lặp: ${name}`);
            });
          }
        } else {
          throw new Error(data.error || response.statusText);
        }
      } else {
        if (data.success) {
          const createdCount = data.created || 0;
          const updatedCount = data.updated || 0;
          const skippedCount = data.skipped || 0;

          toast.success(
            `Nhập dữ liệu hoàn tất: ${createdCount} bản ghi đã tạo, ${updatedCount} bản ghi đã cập nhật${
              skippedCount > 0 ? `, ${skippedCount} bản ghi bị bỏ qua` : ""
            }`
          );

          if (skippedCount > 0) {
            toast.error(
              "Một số bản ghi đã bị bỏ qua do lỗi. Kiểm tra console để biết chi tiết."
            );
          }

          // Immediately refresh the data after successful import
          refreshData();
        } else {
          throw new Error("Nhập dữ liệu thất bại không có lỗi cụ thể");
        }
      }
    } catch (error: any) {
      console.error("Lỗi nhập dữ liệu:", error);
      toast.error(`Nhập dữ liệu thất bại: ${error.message}`);
    } finally {
      setImporting(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    if (selectedCars.length === 0) {
      toast.error("Vui lòng chọn ít nhất một xe để xuất");
      return;
    }

    try {
      setExportLoading(true);

      // Send the IDs of selected cars to the export API
      const response = await fetch(`api/car/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: exportFormat,
          carIds: selectedCars,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename;
      switch (exportFormat) {
        case "excel":
          filename = "danh-sach-xe.xlsx";
          break;
        case "pdf":
          filename = "danh-sach-xe.pdf";
          break;
        case "doc":
          filename = "danh-sach-xe.docx";
          break;
        default:
          filename = "danh-sach-xe.xlsx";
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success(`Xuất ${selectedCars.length} xe thành công`);
    } catch (error: any) {
      toast.error(`Xuất dữ liệu thất bại: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleReport = async () => {
    if (selectedCars.length === 0) {
      toast.error("Vui lòng chọn ít nhất một xe để tạo báo cáo");
      return;
    }

    try {
      const response = await fetch("api/car/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carIds: selectedCars,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bao-cao-xe.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success(
        `Báo cáo cho ${selectedCars.length} xe đã được tạo thành công`
      );
    } catch (error: any) {
      toast.error(`Tạo báo cáo thất bại: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6 items-center flex-wrap">
        <div>
          <label className="inline-flex items-center px-3 py-2 rounded bg-blue-500 text-white text-xs cursor-pointer hover:bg-blue-600 transition-colors">
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileImport}
              disabled={importing}
            />
            <Upload className="h-4 w-4 mr-2" />
            <span>{importing ? "Đang nhập..." : "Nhập File"}</span>
          </label>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExport}
              disabled={exportLoading || selectedCars.length === 0}
              className={`inline-flex items-center px-3 py-2 rounded text-white text-xs 
                ${selectedCars.length === 0 ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} 
                transition-colors`}
            >
              <FileType className="h-4 w-4 mr-2" />
              <span>
                {exportLoading
                  ? "Đang xuất..."
                  : `Xuất (${selectedCars.length})`}
              </span>
            </button>

            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 h-9 border rounded bg-white text-xs"
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
            </select>

            <button
              onClick={handleReport}
              disabled={selectedCars.length === 0}
              className={`inline-flex items-center px-3 py-2 rounded text-white text-xs 
                ${selectedCars.length === 0 ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"} 
                transition-colors`}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>Báo Cáo</span>
            </button>

            <div className="flex items-center ml-4">
              <span className="text-xs text-gray-700 mr-2">
                Đã chọn: {selectedCars.length}
              </span>
              {selectedCars.length > 0 && (
                <button
                  onClick={() => setSelectedCars([])}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportComponent;
