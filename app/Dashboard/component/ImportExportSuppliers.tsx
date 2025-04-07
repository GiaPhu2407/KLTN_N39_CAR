import React, { useState } from 'react';
import { Upload, FileType, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ImportExportComponent = () => {
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  const handleFileImport = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Vui lòng chỉ tải lên file Excel hoặc CSV');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', file.name.endsWith('.csv') ? 'csv' : 'excel');

    try {
      const response = await fetch('api/suppliers/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const result = await response.json();
      
      // Xử lý định dạng phản hồi mới
      if (result.success) {
        const createdCount = result.created || 0;
        const updatedCount = result.updated || 0;
        const skippedCount = result.skipped || 0;
        
        // Hiển thị thông báo thành công chi tiết
        toast.success(
          `Nhập dữ liệu hoàn tất: ${createdCount} bản ghi đã tạo, ${updatedCount} bản ghi đã cập nhật${skippedCount > 0 ? `, ${skippedCount} bản ghi bị bỏ qua` : ''}`
        );
        
        // Đưa ra cảnh báo nếu một số bản ghi bị bỏ qua
        if (skippedCount > 0) {
          toast.error('Một số bản ghi đã bị bỏ qua do lỗi. Kiểm tra console để biết chi tiết.');
        }
      } else {
        throw new Error('Nhập dữ liệu thất bại không có lỗi cụ thể');
      }
      
      // Đặt lại trường nhập file
      event.target.value = '';
      
    } catch (error: any) {
      console.error('Lỗi nhập dữ liệu:', error);
      toast.error(`Nhập dữ liệu thất bại: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

   const handleExport = async () => {
      try {
        const response = await fetch(`api/suppliers/export?format=${exportFormat}`);
        
        if (!response.ok) {
          throw new Error(response.statusText);
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileExtension = exportFormat === 'excel' ? 'xlsx' : exportFormat;
        a.download = `nha-cung-cap.${fileExtension}`;
    
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        toast.success('Xuất dữ liệu thành công');
      } catch (error:any) {
        toast.error(`Xuất dữ liệu thất bại: ${error.message}`);
      }
    };

  const handleReport = async () => {
    try {
      const response = await fetch('api/suppliers/report');
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bao-cao-xe.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('Báo cáo đã được tạo thành công');
    } catch (error:any) {
      toast.error(`Tạo báo cáo thất bại: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6">
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
            <span className='justify-center text-xs'>{importing ? 'Đang nhập...' : 'Nhập File'}</span>
          </label>
        </div>

        {/* Phần Xuất */}
        <div>
          <div className="flex items-center gap-3">
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 btn text-xs btn-primary transition-colors"
            >
              <FileType className="h-6 w-5 mr-2" />
              <span className=''>Xuất</span>
            </button>
            <select
              value={exportFormat}
              onChange={(e:any) => setExportFormat(e.target.value)}
              className="px-3 py-2 h-10 border rounded bg-white text-xs"
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
            </select>

            <button
              onClick={handleReport}
              className="inline-flex items-center px-1 py-1 pr-5 btn text-xs btn-success transition-colors"
            >
              <FileText className="h-6 w-5 mr-2 ml-2" />
              <span className='text-xs'>Tạo</span>
              <span className='text-xs'>Báo Cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportComponent;