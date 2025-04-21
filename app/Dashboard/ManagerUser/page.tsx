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
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  // Since there's no API, we'll just show success message
                  toast.success("Đã xóa người dùng thành công!");
                  refreshData();
                } catch (err) {
                  toast.error(
                    err instanceof Error
                      ? err.message
                      : "Lỗi khi xóa người dùng"
                  );
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

  const validateForm = () => {
    const errors = [];

    if (!formData.Tentaikhoan.trim()) {
      errors.push("Tên tài khoản không được để trống");
    }

    if (!isEditing && !formData.Matkhau.trim()) {
      errors.push("Mật khẩu không được để trống");
    }

    if (!formData.Hoten.trim()) {
      errors.push("Họ tên không được để trống");
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

    if (!formData.Diachi.trim()) {
      errors.push("Địa chỉ không được để trống");
    }

    if (!formData.idRole) {
      errors.push("Vui lòng chọn vai trò");
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    try {
      // Mock successful submission
      toast.success(
        isEditing
          ? "Cập nhật người dùng thành công!"
          : "Thêm mới người dùng thành công!"
      );
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();

      // Close the dialog after successful submission
      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Lỗi ${isEditing ? "cập nhật" : "tạo"} người dùng`
      );
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

  return (
    <div
      className="p-2 flex-col justify-center text-center w-full h-[630px]"
      data-theme="light"
    >
      <div className="flex pb-4 w-full justify-between" data-theme="light">
        <h1 className="text-2xl font-bold text-black ml-10">
          Quản Lý Tài Khoản Người Dùng
        </h1>
        <button className="btn text-xs btn-accent" onClick={handleAddNewClick}>
          Thêm mới
        </button>
      </div>

      <dialog id="my_modal_3" className="modal opacity-100" data-theme="light">
        <div className="modal-box w-full max-w-none" data-theme="light">
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

      <TableUser
        onEdit={handleEdit}
        onDelete={handleDelete}
        reloadKey={reloadKey}
      />
    </div>
  );
}
