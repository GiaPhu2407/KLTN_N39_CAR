"use client";

import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

import toast, { Toaster } from "react-hot-toast";
import TableNhaCungCap from "../component/Table/TableSuppliesManager";

export default function Page() {
  // Dữ liệu mẫu ban đầu
  const [suppliers, setSuppliers] = useState([
    {
      idNhaCungCap: 1,
      TenNhaCungCap: "Công ty TNHH ABC",
      Sdt: "0123456789",
      Email: "abc@example.com",
    },
    {
      idNhaCungCap: 2,
      TenNhaCungCap: "Công ty TNHH XYZ",
      Sdt: "0987654321",
      Email: "xyz@example.com",
    },
  ]);

  const initialFormData = {
    TenNhaCungCap: "",
    Sdt: "",
    Email: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nextId, setNextId] = useState(3); // ID kế tiếp cho nhà cung cấp mới
  const [reloadKey, setReloadKey] = useState(0);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc muốn xóa nhà cung cấp này?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                try {
                  setSuppliers(
                    suppliers.filter((item) => item.idNhaCungCap !== id)
                  );
                  toast.success("Xóa nhà cung cấp thành công");
                  refreshData();
                } catch (err) {
                  toast.error("Lỗi khi xóa nhà cung cấp");
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (supplier: {
    TenNhaCungCap: any;
    Sdt: any;
    Email: any;
    idNhaCungCap: React.SetStateAction<null>;
  }) => {
    setFormData({
      TenNhaCungCap: supplier.TenNhaCungCap,
      Sdt: supplier.Sdt,
      Email: supplier.Email,
    });
    setIsEditing(true);
    setEditingId(supplier.idNhaCungCap);
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.TenNhaCungCap.trim()) {
      errors.push("Tên nhà cung cấp không được để trống");
    }

    if (!formData.Sdt.trim()) {
      errors.push("Số điện thoại không được để trống");
    } else if (!/^[0-9]{10,11}$/.test(formData.Sdt)) {
      errors.push("Số điện thoại không hợp lệ (cần 10-11 số)");
    }

    if (!formData.Email.trim()) {
      errors.push("Email không được để trống");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      errors.push("Email không hợp lệ");
    }

    return errors;
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    try {
      if (isEditing) {
        // Cập nhật nhà cung cấp hiện có
        setSuppliers(
          suppliers.map((item) =>
            item.idNhaCungCap === editingId ? { ...item, ...formData } : item
          )
        );
        toast.success("Cập nhật nhà cung cấp thành công");
      } else {
        // Thêm nhà cung cấp mới
        setSuppliers([...suppliers, { idNhaCungCap: nextId, ...formData }]);
        setNextId(nextId + 1);
        toast.success("Thêm mới nhà cung cấp thành công");
      }

      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();

      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    } catch (err) {
      toast.error(`Lỗi ${isEditing ? "cập nhật" : "tạo"} nhà cung cấp`);
    }
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
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

  // Adapter để TableNhaCungCap có thể hoạt động mà không cần sửa đổi component
  const tableAdapter = {
    onEdit: handleEdit,
    onDelete: handleDelete,
    reloadKey: reloadKey,
    // Giả định component TableNhaCungCap sẽ lấy dữ liệu từ context hoặc nguồn khác
    // Bạn có thể truyền suppliers như một prop nếu cần
    getData: () => suppliers,
  };

  return (
    <div
      className="p-2 flex-col justify-center text-center w-full h-[630px]"
      data-theme="light"
    >
      <Toaster />
      <div className="flex justify-between pb-4 w-full">
        <h1 className="text-2xl font-bold mr-44 flex-grow text-black">
          Quản Lý Nhà Cung Cấp
        </h1>
        <div className="flex-grow">
          <button className="btn btn-accent" onClick={handleAddNewClick}>
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
            {isEditing ? "Cập Nhật Nhà Cung Cấp" : "Thêm Mới Nhà Cung Cấp"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TenNhaCungCap"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Nhà Cung Cấp
                      </label>
                      <input
                        type="text"
                        id="TenNhaCungCap"
                        name="TenNhaCungCap"
                        value={formData.TenNhaCungCap}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="Sdt"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="Sdt"
                        name="Sdt"
                        value={formData.Sdt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="Email"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
        <TableNhaCungCap />
      </div>
    </div>
  );
}
