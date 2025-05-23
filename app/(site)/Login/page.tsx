"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/app/components/AuthContext";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const formValues = {
      usernameOrEmail: formData.get("usernameOrEmail"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      // Extract user data correctly based on the API response structure
      const userData = data.user || data;

      // Update the Auth context with the user information
      setUser(userData);

      const toastPromise = toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1000)),
        {
          loading: "Đang Đăng Nhập...",
          success: "Đã đăng nhập thành công!",
          error: "Có lỗi xảy ra",
        },
        {
          duration: 2000,
        }
      );

      await toastPromise;

      // Check user role and redirect accordingly
      if (data.user?.role === "Admin" || data.role?.TenNguoiDung === "Admin") {
        router.push("/Dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Thông tin đăng nhập không hợp lệ");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          duration: 3000,
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <div className="hero-content flex-col lg:flex-row w-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-2xl p-4 lg:p-8 gap-8 shadow-2xl overflow-hidden">
          {/* Hero Text Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center lg:text-left max-w-md"
          >
            <h1 className="text-3xl lg:text-5xl font-bold text-white">
              Login now!
            </h1>
            <p className="py-4 lg:py-6 text-white text-sm lg:text-base">
              Đăng nhập để khám phá dịch vụ tuyệt vời.
            </p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col space-y-6 text-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Đăng nhập nhanh chóng</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span>Bảo mật tốt nhất</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span>Trải nghiệm tuyệt vời</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Login Form Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-white rounded-xl"
          >
            <div className="card-body p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                Đăng Nhập
              </h2>
              {error && (
                <div className="alert alert-error shadow-lg mb-4">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-gray-700">
                      Tên đăng nhập hoặc Email
                    </span>
                  </label>
                  <input
                    type="text"
                    name="usernameOrEmail"
                    placeholder="Nhập tên đăng nhập hoặc email"
                    className="input input-bordered w-full bg-gray-50 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                    required
                  />
                </div>
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text text-gray-700">Mật khẩu</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Nhập mật khẩu"
                      className="input input-bordered w-full bg-gray-50 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <label className="label">
                    <Link
                      href="/ForgotPassword"
                      className="label-text-alt link link-hover text-violet-600"
                    >
                      Quên mật khẩu?
                    </Link>
                  </label>
                </div>
                <div className="form-control">
                  <button
                    className={`btn btn-primary ${
                      loading ? "" : ""
                    } bg-gradient-to-r from-violet-600 to-blue-500 border-0 hover:from-violet-700 hover:to-blue-600 text-white w-full`}
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    href="/register"
                    className="text-violet-600 font-semibold"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
