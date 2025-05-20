import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Matkhau: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: number;
  Ngaydangky: string;
  role?: {
    TenNguoiDung: string;
  };
}

interface Role {
  idRole: number;
  TenNguoiDung: string;
}

interface TableUserProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}
interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableUser: React.FC<TableUserProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [localReloadKey, setLocalReloadKey] = useState(0);

  // Add states for selection functionality
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch("api/role")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(
      `api/pagination/userpaging?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setUsers(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    // Reset selection when data refreshes
    setSelectedItems([]);
    setSelectAll(false);
  }, [currentPage, pageSize, reloadKey, searchText, localReloadKey]);

  const getRoleName = (idRole: number): string => {
    const role = roles.find((role) => role.idRole === idRole);
    return role?.TenNguoiDung || "N/A";
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Handle item selection toggle
  const toggleSelectItem = (idUser: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(idUser)) {
        return prevSelected.filter((id) => id !== idUser);
      } else {
        return [...prevSelected, idUser];
      }
    });
  };

  // Handle select all toggle
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(users.map((user) => user.idUsers));
    }
    setSelectAll(!selectAll);
  };

  // Check if an item is selected
  const isItemSelected = (idUser: number) => {
    return selectedItems.includes(idUser);
  };

  // Handle delete single user with confirmation
  const handleDeleteSingle = (idUser: number) => {
    const user = users.find((u) => u.idUsers === idUser);
    const userName = user ? user.Hoten : `ID ${idUser}`;

    // Define a unique ID for our confirmation toast
    const confirmationToastId = `delete-single-user-${idUser}`;

    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa người dùng "{userName}" không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onDelete(idUser);
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
        id: confirmationToastId,
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

  // Handle delete all selected users
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("Không có người dùng nào được chọn để xóa");
      return;
    }

    // Define a unique ID for our confirmation toast
    const confirmationToastId = "delete-users-confirmation-toast";

    // Clear any existing confirmation toasts to prevent duplicates
    toast.dismiss(confirmationToastId);

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc chắn muốn xóa {selectedItems.length} người dùng đã chọn
            không?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                // First dismiss the confirmation toast
                toast.dismiss(t.id);

                try {
                  // Show a loading toast while deleting
                  const loadingToastId = toast.loading(
                    "Đang xóa người dùng..."
                  );

                  // Create an array of promises for each delete request
                  const deletePromises = selectedItems.map((idUser) =>
                    fetch(`api/users/${idUser}`, {
                      method: "DELETE",
                    }).then((res) => {
                      if (!res.ok)
                        throw new Error(
                          `Failed to delete user with ID ${idUser}`
                        );
                      return res.json();
                    })
                  );

                  // Wait for all delete operations to complete
                  await Promise.all(deletePromises);

                  // Dismiss the loading toast
                  toast.dismiss(loadingToastId);

                  // Show the success toast
                  toast.success(
                    `Đã xóa ${selectedItems.length} người dùng thành công`
                  );

                  // Reset selections and trigger reload
                  setSelectedItems([]);
                  setSelectAll(false);
                  setLocalReloadKey((prev) => prev + 1);
                } catch (error) {
                  console.error("Error deleting selected users:", error);
                  toast.error("Đã xảy ra lỗi khi xóa các người dùng đã chọn");
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
        id: confirmationToastId,
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="">
          <div className="inline-block min-w-full align-middle">
            <div className="flex flex-wrap justify-between pb-5">
              <div className="mt-3 ml-10">
                <label htmlFor="pageSize" className="text-sm">
                  Số mục mỗi trang:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border rounded px-2 py-1 ml-2"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex items-center gap-4 mr-10">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />

                {/* Add delete selected button */}
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center"
                  >
                    <span className="mr-1">Xóa</span>
                    <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
                      {selectedItems.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-center">
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="checkbox checkbox-sm bg-white"
                        />
                        <span className="pl-1">All</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Tên tài khoản
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40"
                    >
                      Họ tên
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Số điện thoại
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48"
                    >
                      Địa chỉ
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-28"
                    >
                      Vai trò
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Ngày đăng ký
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-4 text-sm text-center"
                      >
                        <span>Đang tải...</span>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-4 text-sm text-center"
                      >
                        Không có dữ liệu người dùng
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user.idUsers}
                        className={`hover:bg-gray-50 ${
                          isItemSelected(user.idUsers) ? "bg-indigo-50" : ""
                        } ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="px-4 py-4 text-sm">
                          <input
                            type="checkbox"
                            checked={isItemSelected(user.idUsers)}
                            onChange={() => toggleSelectItem(user.idUsers)}
                            className="checkbox checkbox-sm bg-white"
                          />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {user.idUsers}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
                          <div className="max-w-full overflow-hidden text-ellipsis">
                            {user.Tentaikhoan}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
                          <div className="max-w-full overflow-hidden text-ellipsis">
                            {user.Hoten}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {user.Sdt}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
                          <div className="max-w-full overflow-hidden text-ellipsis">
                            {user.Diachi}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
                          <div className="max-w-full overflow-hidden text-ellipsis">
                            {user.Email}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {getRoleName(user.idRole)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatDateTime(user.Ngaydangky)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEdit(user)}
                              className="p-1 text-blue-500 hover:text-blue-700"
                            >
                              🖊️
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(user.idUsers)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              ❌
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {paginationMeta && (
        <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Trước
            </button>
            {[...Array(paginationMeta.totalPage)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationMeta.totalPage}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableUser;
