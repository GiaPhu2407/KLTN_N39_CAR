"use client";

import React, { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);


  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    fetch("api/role")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loai xe data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("role data:", data);
        setRoleList(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch role data");
        console.error("Failed to fetch loai xe", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium">Bạn có chắc muốn xóa tài khoản này?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`/api/users/${id}`, {
                  method: "DELETE",
                });

                if (!response.ok) {
                  throw new Error("Failed to delete supplier");
                }

                const data = await response.json();
                toast.success(data.message);
                refreshData();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp");
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
      duration: Infinity, // Don't auto-dismiss
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (product: any) => {
    setFormData({
      Tentaikhoan: product.Tentaikhoan,
      Matkhau: product.Matkhau,
      Hoten: product.Hoten,
      Sdt: product.Sdt,
      Diachi: product.Diachi,
      Email: product.Email,
      idRole: product.idRole.toString(),
    });
    setIsEditing(true);
    setEditingId(product.idUsers);
    // Show the dialog after setting the form data
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = isEditing ? `api/users/${editingId}` : 'api/users';
    const method = isEditing ? 'PUT' : 'POST';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
    if (!emailPattern.test(formData.Email)) {
      toast.error("Email không hợp lệ, vui lòng nhập email có phần mở rộng .com");
      return;
    }
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      const data = await response.json();
      toast.success(data.message);
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
      toast.error(err instanceof Error ? err.message : `Error ${isEditing ? 'updating' : 'creating'} product`);
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme="light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  );

  return (
    <div
      className="p-2 flex-col justify-center text-center w-full h-[630px]"
      data-theme="light"
    >
      <div
        className="flex pb-4 w-full justify-between ml-10"
        data-theme="light"
      >
        <h1 className="text-2xl font-bold text-black">
          Quản Lý Tài Khoản Người Dùng
        </h1>
      </div>

      <dialog id="my_modal_3" className="modal opacity-100" data-theme="light">
        <div className="modal-box max-w-3xl" data-theme="light">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-center">
            {isEditing ? "Cập Nhật Người Dùng" : "Thêm Mới Người Dùng"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="Tentaikhoan"
                  className="block font-medium text-gray-700 text-sm"
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

              <div>
                <label
                  htmlFor="Hoten"
                  className="block font-medium text-gray-700 text-sm"
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

              <div>
                <label
                  htmlFor="Sdt"
                  className="block font-medium text-gray-700 text-sm"
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

              <div>
                <label
                  htmlFor="Email"
                  className="block font-medium text-gray-700 text-sm"
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
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$"
                  title="Vui lòng nhập email hợp lệ với phần mở rộng .com."
                />
              </div>

              <div>
                <label
                  htmlFor="idRole"
                  className="block font-medium text-gray-700 text-sm"
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
                  {roleList.map((role) => (
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

              <div>
                <label
                  htmlFor="Diachi"
                  className="block font-medium text-gray-700 text-sm"
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
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditing ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <TableUser
        onEdit={handleEdit}
        onDelete={handleDelete}
        reloadKey={refreshData}
      />
    </div>
  );
}
