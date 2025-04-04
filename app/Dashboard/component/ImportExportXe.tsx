import React, { useState } from 'react';
import { Upload, FileType, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ImportExportComponent = () => {
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  const handleFileImport = async (event:any) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only Excel or CSV files');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', file.name.endsWith('.csv') ? 'csv' : 'excel');

    try {
      const response = await fetch('api/car/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      toast.success(`Successfully imported ${result.count} records`);
    } catch (error:any) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

   const handleExport = async () => {
      try {
        const response = await fetch(`api/car/export?format=${exportFormat}`);
        
        if (!response.ok) {
          throw new Error(response.statusText);
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileExtension = exportFormat === 'excel' ? 'xlsx' : exportFormat;
        a.download = `cars.${fileExtension}`;
    
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        toast.success('Export successful');
      } catch (error:any) {
        toast.error(`Export failed: ${error.message}`);
      }
    };

  const handleReport = async () => {
    try {
      const response = await fetch('api/car/report');
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'car-report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('Report generated successfully');
    } catch (error:any) {
      toast.error(`Report generation failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6">
        {/* Import Section */}
        <div>
          <label className="inline-flex items-center px-1 py-1 pr-5 btn text-xs btn-accent  cursor-pointer transition-colors">
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileImport}
              disabled={importing}
            />
            <Upload className="h-5 w-5 mr-2 ml-2" />
            <span className='justify-center text-xs'>{importing ? 'Importing...' : 'Import File'}</span>
          </label>
        </div>

        {/* Export Section */}
        <div>
          <div className="flex items-center gap-3">
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 btn text-xs btn-primary transition-colors"
            >
              <FileType className="h-6 w-5 mr-2" />
              <span className=''>Export</span>
            </button>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
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
              <span className='text-xs'>Generate</span>
              <span className='text-xs'>Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportComponent;