"use client";

import React, { useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import TableUser from "../component/Table/TableUsers";

interface Role {
  idRole: number;
  TenNguoiDung: string;
}

interface FormData {
  Tentaikhoan: string;
  Matkhau: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: string;
}

export default function Page() {
  const initialFormData: FormData = {
    Tentaikhoan: "",
    Matkhau: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
    Email: "",
    idRole: "",
  };

  // Mock roles data
  const mockRoles: Role[] = [
    { idRole: 1, TenNguoiDung: "Admin" },
    { idRole: 2, TenNguoiDung: "Nhân viên" },
    { idRole: 3, TenNguoiDung: "Khách hàng" },
  ];

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleDelete = async (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc muốn xóa người dùng này?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.success("Đã xóa người dùng thành công!");
                refreshData();
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
        duration: Infinity, // Don't auto-dismiss
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user: any) => {
    setFormData({
      Tentaikhoan: user.Tentaikhoan,
      Matkhau: user.Matkhau || "",
      Hoten: user.Hoten,
      Sdt: user.Sdt,
      Diachi: user.Diachi,
      Email: user.Email,
      idRole: user.idRole.toString(),
    });
    setIsEditing(true);
    setEditingId(user.idUsers);

    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock successful submission
    toast.success(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
    refreshData();

    // Close the dialog after successful submission
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
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

  const handleAddNew = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <div className="p-2 w-full h-[630px]" data-theme="light">
      <Toaster />
      <div className="flex w-full mb-6">
        <h1 className="text-2xl font-bold mt-1 ml-10 text-black whitespace-nowrap">
          Quản Lý Tài Khoản Người Dùng
        </h1>
        <div className="flex justify-end gap-4 w-full mr-4">
          <button className="btn btn-primary" onClick={handleAddNew}>
            Thêm mới
          </button>
        </div>
      </div>

      <dialog id="my_modal_3" className="modal" data-theme="light">
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
            {isEditing ? "Cập Nhật Người Dùng" : "Thêm Mới Người Dùng"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="Tentaikhoan"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên tài khoản
                      </label>
                      <input
                        type="text"
                        id="Tentaikhoan"
                        name="Tentaikhoan"
                        value={formData.Tentaikhoan}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="Matkhau"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        id="Matkhau"
                        name="Matkhau"
                        value={formData.Matkhau}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isEditing}
                        placeholder={
                          isEditing ? "Để trống nếu không thay đổi" : ""
                        }
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="Hoten"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Họ tên
                      </label>
                      <input
                        type="text"
                        id="Hoten"
                        name="Hoten"
                        value={formData.Hoten}
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
                        type="text"
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
                        htmlFor="Diachi"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        id="Diachi"
                        name="Diachi"
                        value={formData.Diachi}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

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

                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="idRole"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Vai trò
                      </label>
                      <select
                        id="idRole"
                        name="idRole"
                        value={formData.idRole}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn vai trò</option>
                        {mockRoles.map((role) => (
                          <option
                            key={role.idRole}
                            value={role.idRole}
                            className="text-black"
                          >
                            {role.TenNguoiDung}
                          </option>
                        ))}
                      </select>
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

      <div className="flex w-full justify-center px-10">
        <TableUser
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}
