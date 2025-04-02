"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const formValues = {
      email: formData.get("email"),
      username: formData.get("username"),
      fullname: formData.get("fullname"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      password: formData.get("password"),
    };

    // You can add client-side validation here if needed, similar to the LoginFormSchema in the login code

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      // Log the response to debug
      console.log("Register response:", data);

      const toastPromise = toast.promise(
        new Promise((resolve) => setTimeout(resolve, 3500)),
        {
          loading: "Đang Đăng Ký...",
          success: "Đã đăng ký thành công!",
          error: "Có lỗi xảy ra",
        },
        {
          duration: 4000,
        }
      );

      await toastPromise;

      // Redirect to login page after successful registration
      router.push("/Login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Thông tin đăng ký không hợp lệ");
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-6"
      data-theme="light"
    >
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
        className="w-full max-w-5xl"
      >
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden">
          {/* Banner */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex-1 bg-gradient-to-br from-violet-600 to-blue-500 p-8 text-white flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold mb-6">Tạo tài khoản!</h1>
            <p className="text-lg mb-8">
              Hãy đăng ký để trải nghiệm những dịch vụ tốt nhất.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 bg-white p-10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Đăng ký
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error text-sm mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
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
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered rounded-sm p-3  w-full h-12"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                className="input input-bordered rounded-sm p-3 w-full h-12"
                required
              />
              <input
                type="text"
                name="fullname"
                placeholder="Họ và tên"
                className=" p-3 input input-bordered rounded-sm w-full h-12"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                className=" p-3 input input-bordered rounded-sm w-full h-12"
                required
              />
              <textarea
                name="address"
                placeholder="Địa chỉ"
                className=" p-3 input input-bordered rounded-sm w-full h-14 resize-none md:col-span-2"
                required
              />
              <div className="relative md:col-span-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  className=" p-4 input input-bordered rounded-sm h-12 w-full pr-12 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94a10 10 0 0 1-14.13-1.94L1 12s4-7 11-7a10 10 0 0 1 7.27 3M22 22l-5-5" />
                      <path d="M9.88 9.88a3 3 0 0 1 4.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full md:col-span-2 bg-gradient-to-r from-violet-600 to-blue-500 border-0 hover:from-violet-700 hover:to-blue-600 text-white rounded-lg py-2 transition"
              >
                Đăng ký
              </button>
              <p className="md:col-span-2 text-center mt-4 text-gray-700">
                Đã có tài khoản?
                <Link
                  href="/Login"
                  className="text-blue-600 ml-1 hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
