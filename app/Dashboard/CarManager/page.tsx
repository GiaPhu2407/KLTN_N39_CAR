"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TableCarDashboard from "../component/Table/TableCarManager";
import { Fileupload } from "@/app/components/Fileupload";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
}

interface NhaCungCap {
  idNhaCungCap: number;
  TenNhaCungCap: string;
}

interface FormData {
  TenXe: string;
  idLoaiXe: string;
  GiaXe: string;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string[];
  NamSanXuat: string;
  ThongSoKyThuat: string;
  MoTa: string;
  idNhaCungCap: string;
}

export default function Page() {
  const initialFormData: FormData = {
    TenXe: "",
    idLoaiXe: "",
    GiaXe: "",
    MauSac: "",
    DongCo: "",
    TrangThai: "",
    HinhAnh: [],
    NamSanXuat: "",
    ThongSoKyThuat: "",
    MoTa: "",
    idNhaCungCap: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaiXeList, setLoaiXeList] = useState<LoaiXe[]>([]);
  const [nhaCungCapList, setNhaCungCapList] = useState<NhaCungCap[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    // Fetch car types
    fetch("api/typecar")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loai xe data");
        }
        return response.json();
      })
      .then((data) => {
        setLoaiXeList(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch loai xe data");
        console.error("Failed to fetch loai xe", err);
        setLoading(false);
      });
    
    // Fetch suppliers
    fetch("api/suppliers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers data");
        }
        return response.json();
      })
      .then((data) => {
        setNhaCungCapList(data);
      })
      .catch((err) => {
        toast.error("Failed to fetch suppliers data");
        console.error("Failed to fetch suppliers", err);
      });
  }, []);

  const validateForm = (data: FormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Validate TenXe
    if (!data.TenXe.trim()) {
      errors.TenXe = "Tên xe không được để trống";
    } else if (data.TenXe.length > 225) {
      errors.TenXe = "Tên xe không được vượt quá 225 ký tự";
    }
    
    // Validate idLoaiXe
    if (!data.idLoaiXe) {
      errors.idLoaiXe = "Vui lòng chọn loại xe";
    }
    
    // Validate GiaXe
    if (!data.GiaXe.trim()) {
      errors.GiaXe = "Giá xe không được để trống";
    } else {
      const numericValue = data.GiaXe.replace(/[^\d]/g, '');
      if (isNaN(parseFloat(numericValue)) || parseFloat(numericValue) <= 0) {
        errors.GiaXe = "Giá xe phải là số dương";
      }
    }
    
    // Validate MauSac
    if (!data.MauSac.trim()) {
      errors.MauSac = "Màu sắc không được để trống";
    } else if (data.MauSac.length > 50) {
      errors.MauSac = "Màu sắc không được vượt quá 50 ký tự";
    }
    
    // Validate DongCo
    if (!data.DongCo.trim()) {
      errors.DongCo = "Động cơ không được để trống";
    } else if (data.DongCo.length > 225) {
      errors.DongCo = "Động cơ không được vượt quá 225 ký tự";
    }
    
    // Validate TrangThai
    if (!data.TrangThai) {
      errors.TrangThai = "Vui lòng chọn trạng thái";
    } else if (!["Còn Hàng", "Hết Hàng"].includes(data.TrangThai)) {
      errors.TrangThai = "Trạng thái không hợp lệ";
    }
    
    // Validate HinhAnh
    if (!data.HinhAnh || data.HinhAnh.length === 0) {
      errors.HinhAnh = "Cần tối thiểu 1 hình ảnh";
    }
    
    // Validate NamSanXuat
    if (!data.NamSanXuat) {
      errors.NamSanXuat = "Năm sản xuất không được để trống";
    } else {
      const year = parseInt(data.NamSanXuat);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        errors.NamSanXuat = "Năm sản xuất không hợp lệ";
      }
    }
    
    // Validate idNhaCungCap (not required, but must be valid if provided)
    if (data.idNhaCungCap && isNaN(parseInt(data.idNhaCungCap))) {
      errors.idNhaCungCap = "Nhà cung cấp không hợp lệ";
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium">Bạn có chắc muốn xóa sản phẩm này?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`api/car/${id}`, {
                  method: "DELETE",
                });
  
                if (!response.ok) {
                  throw new Error("Failed to delete product");
                }
  
                const data = await response.json();
                toast.success(data.message);
                refreshData();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#000',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    });
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Convert to number and format with thousands separators
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(numericValue || '0'));
    
    return formatted;
  };

  const unformatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    return value.replace(/[^0-9]/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price input
    if (name === 'GiaXe') {
      const formattedValue = formatCurrency(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
      // Display all validation errors
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });
      return;
    }
    
    const url = isEditing ? `api/car/${editingId}` : 'api/car';
    const method = isEditing ? 'PUT' : 'POST';
  
    try {
      // Ensure HinhAnh is an array and unformat the price
      const submitData = {
        ...formData,
        HinhAnh: Array.isArray(formData.HinhAnh) ? formData.HinhAnh : [formData.HinhAnh],
        GiaXe: unformatCurrency(formData.GiaXe), // Unformat the price for submission
        idNhaCungCap: formData.idNhaCungCap ? parseInt(formData.idNhaCungCap) : null
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors from the server
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, errorObj]: [string, any]) => {
            if (errorObj._errors && errorObj._errors.length > 0) {
              toast.error(`${field}: ${errorObj._errors[0]}`);
            }
          });
          throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
        }
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }
  
      toast.success(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();
  
      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Error ${isEditing ? 'updating' : 'creating'} product`);
    }
  };

  const handleEdit = (product: any) => {
    // Convert the stored image string back to an array
    const images = product.HinhAnh ? 
        (typeof product.HinhAnh === 'string' ? product.HinhAnh.split('|') : product.HinhAnh) : 
        [];
    
    setFormData({
        TenXe: product.TenXe || "",
        idLoaiXe: product.idLoaiXe ? product.idLoaiXe.toString() : "",
        GiaXe: formatCurrency(product.GiaXe ? product.GiaXe.toString() : "0"),
        MauSac: product.MauSac || "",
        DongCo: product.DongCo || "",
        TrangThai: product.TrangThai || "",
        HinhAnh: images,
        NamSanXuat: product.NamSanXuat ? product.NamSanXuat.toString() : "",
        ThongSoKyThuat: product.ThongSoKyThuat || "",
        MoTa: product.MoTa || "",
        idNhaCungCap: product.idNhaCungCap ? product.idNhaCungCap.toString() : "",
    });
    setIsEditing(true);
    setEditingId(product.idXe);
    
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
        dialog.showModal();
    }
  };

  const handleModalClose = () => {
    if (!isEditing) {
      setFormData(initialFormData);
    }
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  const handleAddNewClick = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme="light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  );

  return (
    <div className="p-2 flex-col justify-center text-center w-full h-[630px]" data-theme="light">
      <div className="flex pb-4 w-full justify-start" data-theme="light">
        <h1 className="text-2xl mr-[700px] font-bold flex-grow text-black">
          Quản Lý Sản Phẩm
        </h1>
        <button className="btn text-xs btn-accent" onClick={handleAddNewClick}>Thêm mới</button>
      </div>

      <dialog id="my_modal_3" className="modal opacity-100" data-theme="light">
        <div className="modal-box w-11/12 max-w-5xl" data-theme="light">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleModalClose}>
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-[20000px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TenXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Xe
                      </label>
                      <input
                        type="text"
                        id="TenXe"
                        name="TenXe"
                        value={formData.TenXe}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="idLoaiXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Loại Xe
                      </label>
                      <select
                        id="idLoaiXe"
                        name="idLoaiXe"
                        value={formData.idLoaiXe}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn loại xe</option>
                        {loaiXeList.map((loaiXe) => (
                          <option
                            key={loaiXe.idLoaiXe}
                            value={loaiXe.idLoaiXe}
                            className="text-black"
                          >
                            {loaiXe.TenLoai}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="GiaXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Giá Xe
                      </label>
                      <input
                        type="text"
                        id="GiaXe"
                        name="GiaXe"
                        value={formData.GiaXe}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="MauSac"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Màu Sắc
                      </label>
                      <input
                        type="text"
                        id="MauSac"
                        name="MauSac"
                        value={formData.MauSac}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="DongCo"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Động Cơ
                      </label>
                      <input
                        type="text"
                        id="DongCo"
                        name="DongCo"
                        value={formData.DongCo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="NamSanXuat"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Năm Sản Xuất
                      </label>
                      <input
                        type="number"
                        id="NamSanXuat"
                        name="NamSanXuat"
                        value={formData.NamSanXuat}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TrangThai"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Trạng Thái
                      </label>
                      <select
                        id="TrangThai"
                        name="TrangThai"
                        value={formData.TrangThai}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="Còn Hàng">Còn Hàng</option>
                        <option value="Hết Hàng">Hết Hàng</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="idNhaCungCap"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Nhà Cung Cấp
                      </label>
                      <select
                        id="idNhaCungCap"
                        name="idNhaCungCap"
                        value={formData.idNhaCungCap}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn nhà cung cấp</option>
                        {nhaCungCapList.map((ncc) => (
                          <option
                            key={ncc.idNhaCungCap}
                            value={ncc.idNhaCungCap}
                            className="text-black"
                          >
                            {ncc.TenNhaCungCap}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="ThongSoKyThuat"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Thông Số Kỹ Thuật
                      </label>
                      <textarea
                        id="ThongSoKyThuat"
                        name="ThongSoKyThuat"
                        value={formData.ThongSoKyThuat}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  
                    <div className="flex-1">
                      <label
                        htmlFor="MoTa"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Mô Tả
                      </label>
                      <textarea
                        id="MoTa"
                        name="MoTa"
                        value={formData.MoTa}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="HinhAnh"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Hình Ảnh
                      </label>
                      <Fileupload 
                        endpoint='imageUploader'
                        onChange={(urls) => setFormData(prev => ({ ...prev, HinhAnh: urls }))}
                        value={formData.HinhAnh}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isEditing ? "Cập Nhật" : "Thêm Mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
      
        <TableCarDashboard 
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={reloadKey} 
        />
      
    </div>
  );
}