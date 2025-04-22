"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { UserAuth } from "@/app/types/auth";
import Footer from "@/app/components/Footer";
import { Fileupload } from "@/app/components/Fileupload";

const ProfilePage = () => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    Email: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
  });

  const [formData, setFormData] = useState({
    Tentaikhoan: "",
    Email: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
    Avatar: [] as string[],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);

        // Convert Avatar string to array if it exists
        const avatarArray = userData.Avatar
          ? typeof userData.Avatar === "string"
            ? userData.Avatar.split("|")
            : userData.Avatar
          : [];

        setFormData({
          Tentaikhoan: userData.Tentaikhoan || "",
          Email: userData.Email || "",
          Hoten: userData.Hoten || "",
          Sdt: userData.Sdt || "",
          Diachi: userData.Diachi || "",
          Avatar: avatarArray,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      Email: "",
      Hoten: "",
      Sdt: "",
      Diachi: "",
    };

    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = "Email không được để trống";
      isValid = false;
    } else {
      // Check email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.Email)) {
        newErrors.Email =
          "Email không đúng định dạng (phải có @ và đuôi .com, .vn, ...)";
        isValid = false;
      }
    }

    // Full name validation
    if (!formData.Hoten.trim()) {
      newErrors.Hoten = "Họ tên không được để trống";
      isValid = false;
    }

    // Phone number validation
    if (formData.Sdt.trim()) {
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(formData.Sdt)) {
        newErrors.Sdt = "Số điện thoại phải có 10 đến 11 số";
        isValid = false;
      }
    } else {
      newErrors.Sdt = "Số điện thoại không được để trống";
      isValid = false;
    }

    // Address validation
    if (!formData.Diachi.trim()) {
      newErrors.Diachi = "Địa chỉ không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Vui lòng kiểm tra lại thông tin");
      setMessageType("error");
      return;
    }

    try {
      // Prepare data for API - join the array to a string if needed by API
      const apiFormData = {
        ...formData,
        Avatar: Array.isArray(formData.Avatar)
          ? formData.Avatar.join("|")
          : formData.Avatar,
      };

      const response = await fetch(`/api/users/${user?.idUsers}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Cập nhật thông tin thành công!");
        setMessageType("success");
        setIsEditing(false);

        // Update local user data - ensure the Avatar property matches the type in UserAuth
        if (user) {
          setUser({
            ...user,
            Tentaikhoan: formData.Tentaikhoan,
            Email: formData.Email,
            Hoten: formData.Hoten,
            Sdt: formData.Sdt,
            DiaChi: formData.Diachi,
            // Convert array back to string for the user state
            Avatar: Array.isArray(formData.Avatar)
              ? formData.Avatar.join("|")
              : formData.Avatar,
          });
        }
      } else {
        setMessage(data.error || "Cập nhật thông tin thất bại");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi cập nhật thông tin");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 3000);
  };

  if (isLoading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 pt-20 ">
      <div className="container mx-auto px-4 pt-20 pb-44">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md ${
                isEditing
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4">
                {formData.Avatar && formData.Avatar.length > 0 ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={formData.Avatar[0]}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-500 font-bold flex items-center justify-center">
                    <span className="text-white text-3xl">
                      {formData.Hoten
                        ? formData.Hoten.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh đại diện
                  </label>
                  <Fileupload
                    endpoint="imageUploader"
                    onChange={(urls) =>
                      setFormData((prev) => ({ ...prev, Avatar: urls }))
                    }
                    value={formData.Avatar}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border ${
                    !isEditing
                      ? "bg-gray-100 text-black"
                      : "bg-white text-black"
                  } ${
                    errors.Email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                />
                {errors.Email && (
                  <p className="mt-1 text-sm text-red-500">{errors.Email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Hoten"
                  value={formData.Hoten}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border ${
                    !isEditing
                      ? "bg-gray-100 text-black"
                      : "bg-white text-black"
                  } ${
                    errors.Hoten ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                />
                {errors.Hoten && (
                  <p className="mt-1 text-sm text-red-500">{errors.Hoten}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="Sdt"
                  value={formData.Sdt}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border ${
                    !isEditing
                      ? "bg-gray-100 text-black"
                      : "bg-white text-black"
                  } ${
                    errors.Sdt ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                />
                {errors.Sdt && (
                  <p className="mt-1 text-sm text-red-500">{errors.Sdt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Diachi"
                  value={formData.Diachi}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border ${
                    !isEditing
                      ? "bg-gray-100 text-black"
                      : "bg-white text-black"
                  } ${
                    errors.Diachi ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
                />
                {errors.Diachi && (
                  <p className="mt-1 text-sm text-red-500">{errors.Diachi}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;