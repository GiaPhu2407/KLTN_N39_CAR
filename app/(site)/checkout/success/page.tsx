
//checkout/success/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {/* {processing ? 'Đang xử lý thanh toán...' : 'Thanh toán thành công!'} */}
        </h1>
        <p className="text-gray-600">
          {/* {processing ? 'Vui lòng đợi trong giây lát...' : 'Bạn sẽ được chuyển hướng tới trang đơn hàng...'} */}
        </p>
      </div>
    </div>
  );
}
