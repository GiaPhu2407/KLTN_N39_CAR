'use client';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-6" data-theme="light">
            <Toaster />
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
                        <p className="text-lg mb-8">Hãy đăng ký để trải nghiệm những dịch vụ tốt nhất.</p>
                    </motion.div>
                    
                    {/* Form */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex-1 bg-white p-10"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Đăng ký</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <input type="email" name="email" placeholder="Email" className="border p-3 rounded w-full h-12" />
                            <input type="text" name="username" placeholder="Tên đăng nhập" className="border p-3 rounded w-full h-12" />
                            <input type="text" name="fullname" placeholder="Họ và tên" className="border p-3 rounded w-full h-12" />
                            <input type="tel" name="phone" placeholder="Số điện thoại" className="border p-3 rounded w-full h-12" />
                            <textarea name="address" placeholder="Địa chỉ" className="border p-3 rounded w-full h-24 resize-none" />
                            <div className="flex flex-col">
                                <input type="file" name="avatar" placeholder="Avatar" className="border p-3 rounded w-full h-24" />
                            </div>
                            <div className="relative md:col-span-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mật khẩu"
                                    className="border p-4 rounded h-12 w-full pr-12 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94a10 10 0 0 1-14.13-1.94L1 12s4-7 11-7a10 10 0 0 1 7.27 3M22 22l-5-5" />
                                            <path d="M9.88 9.88a3 3 0 0 1 4.24 4.24" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <button type="submit" className="w-full md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                Đăng ký
                            </button>
                            <p className="md:col-span-2 text-center mt-4 text-gray-700">
                                Đã có tài khoản?
                                <Link href="/Login" className="text-blue-600 ml-1 hover:underline">
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
