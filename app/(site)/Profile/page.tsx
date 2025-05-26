"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
} from "lucide-react";
import { UserAuth } from "@/app/types/auth";
import Footer from "@/app/components/Footer";
import { Fileupload } from "@/app/components/Fileupload";
import CozeChat from "@/app/components/CozeAi";

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Thông Tin Cá Nhân
            </h1>
            <p className="text-gray-600">
              Quản lý và cập nhật thông tin tài khoản của bạn
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
                    {formData.Avatar && formData.Avatar.length > 0 ? (
                      <img
                        src={formData.Avatar[0]}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {formData.Hoten
                            ? formData.Hoten.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {formData.Hoten || "Chưa cập nhật"}
                  </h2>
                  <p className="text-white/80 mb-4">
                    @{formData.Tentaikhoan || "username"}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                      isEditing
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>Hủy chỉnh sửa</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        <span>Chỉnh sửa thông tin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Alert Message */}
            {message && (
              <div className="mx-8 mt-6">
                <div
                  className={`p-4 rounded-2xl border flex items-center space-x-3 ${
                    messageType === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  } transition-all duration-300 animate-in slide-in-from-top-2`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Upload Section */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <Camera className="inline w-4 h-4 mr-2" />
                      Cập nhật ảnh đại diện
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

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Mail className="inline w-4 h-4 mr-2 text-blue-500" />
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200 text-gray-700"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } ${
                          errors.Email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.Email && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.Email}</span>
                      </p>
                    )}
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <User className="inline w-4 h-4 mr-2 text-green-500" />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="Hoten"
                        value={formData.Hoten}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200 text-gray-700"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } ${
                          errors.Hoten
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        placeholder="Nhập họ và tên đầy đủ"
                      />
                    </div>
                    {errors.Hoten && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.Hoten}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Phone className="inline w-4 h-4 mr-2 text-purple-500" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="Sdt"
                        value={formData.Sdt}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200 text-gray-700"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } ${
                          errors.Sdt
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.Sdt && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.Sdt}</span>
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <MapPin className="inline w-4 h-4 mr-2 text-red-500" />
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="Diachi"
                        value={formData.Diachi}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          !isEditing
                            ? "bg-gray-50 border-gray-200 text-gray-700"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } ${
                          errors.Diachi
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        placeholder="Nhập địa chỉ chi tiết"
                      />
                    </div>
                    {errors.Diachi && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.Diachi}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <Save className="w-5 h-5" />
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CozeChat />
    </div>
  );
};

export default ProfilePage;
