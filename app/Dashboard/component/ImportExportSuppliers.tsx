import React, { useState } from "react";
import { Upload, FileType, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImportExportProps {
  onImportSuccess?: () => void;
  selectedItems: number[]; // Array of selected supplier IDs
  totalItems: number; // Total number of suppliers
}

const ImportExportComponent: React.FC<ImportExportProps> = ({
  onImportSuccess,
  selectedItems,
  totalItems,
}) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");

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
      const response = await fetch("api/suppliers/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const result = await response.json();

      // Xử lý định dạng phản hồi
      if (result.success) {
        const createdCount = result.created || 0;
        const updatedCount = result.updated || 0;
        const skippedCount = result.skipped || 0;

        // Hiển thị thông báo thành công chi tiết
        toast.success(
          `Nhập dữ liệu hoàn tất: ${createdCount} bản ghi đã tạo, ${updatedCount} bản ghi đã cập nhật${skippedCount > 0 ? `, ${skippedCount} bản ghi bị bỏ qua` : ""}`
        );

        // Đưa ra cảnh báo nếu một số bản ghi bị bỏ qua
        if (skippedCount > 0) {
          toast.error(
            "Một số bản ghi đã bị bỏ qua do lỗi. Kiểm tra console để biết chi tiết."
          );
        }

        // Gọi callback để thông báo cho component cha về việc import thành công
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        throw new Error("Nhập dữ liệu thất bại không có lỗi cụ thể");
      }

      // Đặt lại trường nhập file
      event.target.value = "";
    } catch (error: any) {
      console.error("Lỗi nhập dữ liệu:", error);
      toast.error(`Nhập dữ liệu thất bại: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    // Check if there are selected items or items to export
    if (totalItems === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    try {
      setExporting(true);
      const loadingToastId = toast.loading("Đang xuất dữ liệu...");

      const response = await fetch(`api/suppliers/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: exportFormat,
          selectedIds: selectedItems.length > 0 ? selectedItems : [], // Empty array means export all
        }),
      });

      toast.dismiss(loadingToastId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExtension = exportFormat === "excel" ? "xlsx" : exportFormat;
      a.download = `nha-cung-cap.${fileExtension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      const itemCount =
        selectedItems.length > 0 ? selectedItems.length : totalItems;
      const selectionText = selectedItems.length > 0 ? "đã chọn" : "tất cả";
      toast.success(
        `Đã xuất ${itemCount} nhà cung cấp ${selectionText} thành công`
      );
    } catch (error: any) {
      toast.error(`Xuất dữ liệu thất bại: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleReport = async () => {
    // Check if there are items to report on
    if (totalItems === 0) {
      toast.error("Không có dữ liệu để tạo báo cáo");
      return;
    }

    try {
      const loadingToastId = toast.loading("Đang tạo báo cáo...");

      const response = await fetch("api/suppliers/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedIds: selectedItems.length > 0 ? selectedItems : [], // Empty array means report all
        }),
      });

      toast.dismiss(loadingToastId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bao-cao-nha-cung-cap.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      const itemCount =
        selectedItems.length > 0 ? selectedItems.length : totalItems;
      const selectionText = selectedItems.length > 0 ? "đã chọn" : "tất cả";
      toast.success(
        `Đã tạo báo cáo cho ${itemCount} nhà cung cấp ${selectionText} thành công`
      );
    } catch (error: any) {
      toast.error(`Tạo báo cáo thất bại: ${error.message}`);
    }
  };

  // Get export button text based on selection
  const getExportButtonText = () => {
    if (selectedItems.length > 0) {
      return `Xuất (${selectedItems.length})`;
    }
    return "Xuất tất cả";
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Phần Nhập */}
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

        {/* Phần Xuất */}
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting || totalItems === 0}
              className={`inline-flex items-center px-4 py-2 btn text-xs ${
                selectedItems.length > 0 ? "btn-primary" : "btn-primary"
              } transition-colors ${
                exporting || totalItems === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FileType className="h-6 w-5 mr-2" />
              <span className="">
                {exporting ? "Đang xuất..." : getExportButtonText()}
              </span>
            </button>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 h-10 border rounded bg-white text-xs"
              disabled={exporting}
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
            </select>

            <button
              onClick={handleReport}
              disabled={totalItems === 0}
              className={`inline-flex items-center px-1 py-1 pr-5 btn text-xs btn-success transition-colors ${
                totalItems === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FileText className="h-6 w-5 mr-2 ml-2" />
              <span className="text-xs">Tạo</span>
              {selectedItems.length > 0 && (
                <span className="ml-1 bg-white text-success-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  {selectedItems.length}
                </span>
              )}
              <span className="text-xs ml-1">Báo Cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportComponent;
