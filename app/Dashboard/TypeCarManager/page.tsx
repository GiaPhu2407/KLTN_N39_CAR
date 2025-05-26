"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TableLoaiXe from "../component/Table/TableTypeCarManager";
import { Fileupload } from "@/app/components/Fileupload";

interface FormData {
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string[];
}

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string | string[];
}

export default function Page() {
  const initialFormData: FormData = {
    TenLoai: "",
    NhanHieu: "",
    HinhAnh: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock function to refresh data
  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  // Mock function to handle deletion
  const handleDelete = async (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">Bạn có chắc muốn xóa loại xe này?</span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(`api/typecar/${id}`, {
                    method: "DELETE",
                  });
                  if (!response.ok) {
                    throw new Error("Failed to delete category");
                  }

                  const data = await response.json();
                  toast.success(data.message);
                  refreshData();
                } catch (err) {}
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
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (category: any) => {
    const images = category.HinhAnh
      ? typeof category.HinhAnh === "string"
        ? category.HinhAnh.split("|")
        : category.HinhAnh
      : [];

    setFormData({
      TenLoai: category.TenLoai,
      NhanHieu: category.NhanHieu,
      HinhAnh: images,
    });
    setIsEditing(true);
    setEditingId(category.idLoaiXe);

    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `api/typecar/${editingId}` : "api/typecar";
    const method = isEditing ? "PUT" : "POST";

    try {
      const submitData = {
        ...formData,
        HinhAnh: Array.isArray(formData.HinhAnh)
          ? formData.HinhAnh
          : [formData.HinhAnh],
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} category`
        );
      }

      const data = await response.json();

      // Chỉ hiển thị 1 toast thành công
      toast.success(
        isEditing
          ? "Cập nhật loại xe thành công!"
          : "Thêm mới loại xe thành công!"
      );

      // Reset form và đóng modal
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);

      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

      // Refresh data sau khi đóng modal và hiển thị toast
      refreshData();
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        isEditing ? "Cập nhật loại xe thất bại!" : "Thêm mới loại xe thất bại!"
      );
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

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  return (
    <div className="p-2 flex-col justify-center text-center w-full h-[600px] ">
      <div className="flex justify-between pb-4 w-full">
        <h1 className="text-2xl font-bold ml-10 text-black">Quản Lý Loại Xe</h1>
        <div>
          <button
            className="btn text-xs btn-accent"
            onClick={handleAddNewClick}
          >
            Thêm mới
          </button>
        </div>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            {isEditing ? "Cập Nhật Loại Xe" : "Thêm Mới Loại Xe"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-[20000px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TenLoai"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Loại Xe
                      </label>
                      <input
                        type="text"
                        id="TenLoai"
                        name="TenLoai"
                        value={formData.TenLoai}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="NhanHieu"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Nhãn Hiệu
                      </label>
                      <input
                        type="text"
                        id="NhanHieu"
                        name="NhanHieu"
                        value={formData.NhanHieu}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                      {/* <Fileupload
                        endpoint="imageUploader"
                        onChange={(urls) =>
                          setFormData(prev) =>
                            setFormData({ ...prev, HinhAnh: urls })
                          
                        }
                        value={formData.HinhAnh}
                      /> */}
                      <Fileupload
                        endpoint="imageUploader"
                        onChange={(urls) =>
                          setFormData((prev) => ({ ...prev, HinhAnh: urls }))
                        }
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

      <div className="flex w-full justify-center">
        <TableLoaiXe
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}
