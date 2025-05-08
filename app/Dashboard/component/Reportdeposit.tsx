import React from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportDatCocComponentProps {
  selectedDeposits: number[];
}

const ReportDatCocComponent: React.FC<ReportDatCocComponentProps> = ({ selectedDeposits }) => {
  const handleGenerateReport = async () => {
    if (selectedDeposits.length === 0) {
      toast.error('Vui lòng chọn ít nhất một đơn đặt cọc');
      return;
    }

    try {
      const depositIds = selectedDeposits.join(',');
      const response = await fetch(`api/deposit/report?depositIds=${depositIds}`);
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dieu-khoan-dat-coc.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('Xuất báo cáo đặt cọc thành công');
    } catch (error: any) {
      toast.error(`Lỗi khi xuất báo cáo: ${error.message || 'Đã xảy ra lỗi'}`);
      console.error('Error generating deposit report:', error);
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={selectedDeposits.length === 0}
      className={`inline-flex items-center px-3 py-2 text-white rounded-lg transition-colors ${
        selectedDeposits.length === 0 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      <FileText className="h-5 w-5 mr-2" />
      Xuất điều khoản đặt cọc ({selectedDeposits.length})
    </button>
  );
};

export default ReportDatCocComponent;