"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <div className="mb-4">
          {/* {processing ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          ) : (
            <div className="text-green-500 text-4xl mb-2">✓</div>
          )} */}
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {/* {processing ? 'Đang xử lý thanh toán...' : 'Thanh toán thành công!'} */}
        </h1>
        <p className="text-gray-600">
          {/* {processing ? 'Vui lòng đợi trong giây lát...' : 'Bạn sẽ được chuyển hướng tới trang chủ...'} */}
        </p>
      </div>
    </div>
  );
}