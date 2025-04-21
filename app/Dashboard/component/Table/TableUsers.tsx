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

const TableUser: React.FC<TableUserProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  // Mock data for roles
  const mockRoles: Role[] = [
    { idRole: 1, TenNguoiDung: "Admin" },
    { idRole: 2, TenNguoiDung: "Nhân viên" },
    { idRole: 3, TenNguoiDung: "Khách hàng" },
  ];

  // Mock data for users
  const mockUsers: User[] = [
    {
      idUsers: 1,
      Tentaikhoan: "admin",
      Matkhau: "******",
      Hoten: "Nguyễn Văn Admin",
      Sdt: "0987654321",
      Diachi: "123 Đường Lê Lợi, TP. Hồ Chí Minh",
      Email: "admin@example.com",
      idRole: 1,
      Ngaydangky: "2023-01-15",
    },
    {
      idUsers: 2,
      Tentaikhoan: "nhanvien1",
      Matkhau: "******",
      Hoten: "Trần Thị Nhân Viên",
      Sdt: "0912345678",
      Diachi: "456 Đường Nguyễn Huệ, TP. Hồ Chí Minh",
      Email: "nhanvien1@example.com",
      idRole: 2,
      Ngaydangky: "2023-02-20",
    },
    {
      idUsers: 3,
      Tentaikhoan: "khachhang1",
      Matkhau: "******",
      Hoten: "Lê Văn Khách",
      Sdt: "0909876543",
      Diachi: "789 Đường Võ Văn Tần, TP. Hồ Chí Minh",
      Email: "khachhang1@example.com",
      idRole: 3,
      Ngaydangky: "2023-03-10",
    },
    {
      idUsers: 4,
      Tentaikhoan: "khachhang2",
      Matkhau: "******",
      Hoten: "Phạm Thị Hương",
      Sdt: "0976543210",
      Diachi: "101 Đường Cách Mạng Tháng 8, TP. Hồ Chí Minh",
      Email: "khachhang2@example.com",
      idRole: 3,
      Ngaydangky: "2023-04-05",
    },
    {
      idUsers: 5,
      Tentaikhoan: "nhanvien2",
      Matkhau: "******",
      Hoten: "Hoàng Minh Tuấn",
      Sdt: "0965432109",
      Diachi: "202 Đường 3/2, TP. Hồ Chí Minh",
      Email: "nhanvien2@example.com",
      idRole: 2,
      Ngaydangky: "2023-05-12",
    },
    {
      idUsers: 6,
      Tentaikhoan: "khachhang3",
      Matkhau: "******",
      Hoten: "Ngô Thanh Tâm",
      Sdt: "0954321098",
      Diachi: "303 Đường Nguyễn Đình Chiểu, TP. Hồ Chí Minh",
      Email: "khachhang3@example.com",
      idRole: 3,
      Ngaydangky: "2023-06-18",
    },
    {
      idUsers: 7,
      Tentaikhoan: "khachhang4",
      Matkhau: "******",
      Hoten: "Đỗ Minh Khoa",
      Sdt: "0943210987",
      Diachi: "404 Đường Hai Bà Trưng, TP. Hồ Chí Minh",
      Email: "khachhang4@example.com",
      idRole: 3,
      Ngaydangky: "2023-07-20",
    },
  ];

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Effect to initialize and filter data
  useEffect(() => {
    // Set the initial data
    setUsers(mockUsers);

    // Filter and paginate data
    const filtered = mockUsers.filter(
      (user) =>
        user.Hoten.toLowerCase().includes(searchText.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.Tentaikhoan.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [searchText, pageSize, reloadKey]);

  const getRoleName = (idRole: number): string => {
    const role = mockRoles.find((role) => role.idRole === idRole);
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

  const handleExport = () => {
    toast.success("Đã xuất dữ liệu thành công!");
  };

  // Calculate current users to display
  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="">
          <div className="inline-block min-w-full align-middle">
            <div className="flex justify-between pb-5">
              <div className="mt-3">
                <label htmlFor="pageSize" className="text-sm ml-64">
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
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
                <button
                  onClick={handleExport}
                  className="btn btn-outline btn-success"
                >
                  Xuất Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-center">
                    <th
                      scope="col"
                      className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Tên tài khoản
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40"
                    >
                      Họ tên
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Số điện thoại
                    </th>
                    <th
                      scope="col"
                      className="px-40 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48"
                    >
                      Địa chỉ
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-28"
                    >
                      Vai trò
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32"
                    >
                      Ngày đăng ký
                    </th>
                    <th
                      scope="col"
                      className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-4 text-sm text-center">
                        Không có dữ liệu người dùng
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.idUsers} className="hover:bg-gray-50">
                        <td className="px-10 py-4 text-sm text-gray-900">
                          {user.idUsers}
                        </td>
                        <td className="px-10 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
                          <div className="max-w-full overflow-hidden text-ellipsis">
                            {user.Tentaikhoan}
                          </div>
                        </td>
                        <td className="px-10 py-4 text-sm text-gray-900 overflow-hidden text-ellipsis">
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
                              onClick={() => onDelete(user.idUsers)}
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

      <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableUser;
