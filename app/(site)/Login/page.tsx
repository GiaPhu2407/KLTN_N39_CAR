'use client';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden w-full">
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex-1 bg-gradient-to-br from-violet-600 to-blue-500 p-12 text-white">
            <h1 className="text-5xl font-bold mb-8">Login Now!</h1>
            <p className="text-xl mb-10">Đăng nhập để khám phá dịch vụ tuyệt vời.</p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col space-y-6 text-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Đăng nhập nhanh chóng</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>An toàn & bảo mật</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Giao diện thân thiện</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex-1 bg-white p-12">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">Đăng nhập</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">Email</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded text-lg" placeholder="Nhập email" />
              </div>
              <div className="mb-6 relative">
                <label className="block text-lg font-medium text-gray-700">Mật khẩu</label>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded text-lg" placeholder="Nhập mật khẩu" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded text-lg font-semibold">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
              <p className="text-center mt-6 text-lg">Chưa có tài khoản? <Link href="/Register" className="text-blue-600">Đăng ký ngay</Link></p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}