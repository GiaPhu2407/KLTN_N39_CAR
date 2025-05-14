"use client";

import React, { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import TableDanhGiaTraiNghiem from "../component/Table/TableEvaluation";

interface ReviewData {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number | null;
  NoiDung: string | null;
  NgayDanhGia: string;
  AnHien: boolean;
  lichHenTraiNghiem: {
    TenKhachHang: string | null;
    Sdt: string | null;
    Email: string | null;
  };
  xe: {
    TenXe: string | null;
    GiaXe: number | null;
  };
}

export default function Page() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleDelete = async (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Bạn có chắc muốn xóa đánh giá này?
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await fetch(`api/evaluate/${id}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) {
                    throw new Error("Failed to delete review");
                  }

                  const data = await response.json();
                  toast.success(data.message);
                  refreshData();
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Lỗi khi xóa đánh giá"
                  );
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

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`api/evaluate/visibility/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          AnHien: !currentStatus 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review visibility");
      }

      const data = await response.json();
      toast.success(data.message);
      refreshData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái đánh giá"
      );
    }
  };

  const handleView = (review: ReviewData) => {
    setReviewData(review);

    const dialog = document.getElementById("review_modal") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleModalClose = () => {
    setReviewData(null);
    const dialog = document.getElementById("review_modal") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  // Function to render star rating
  const renderStarRating = (rating: number | null) => {
    if (!rating) return "Chưa đánh giá";

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return <div className="flex">{stars}</div>;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  return (
    <div
      className="p-2 flex-col justify-center text-center w-full h-[630px]"
    >
      <div className="flex justify-between pb-4 w-full">
        <h1 className="text-2xl font-bold flex-grow text-black text-center">
          Quản Lý Đánh Giá Trải Nghiệm
        </h1>
      </div>

      <dialog id="review_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-center">Chi Tiết Đánh Giá</h3>
          {reviewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Khách Hàng
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {reviewData.lichHenTraiNghiem?.TenKhachHang || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Số Điện Thoại
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {reviewData.lichHenTraiNghiem?.Sdt || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Email
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {reviewData.lichHenTraiNghiem?.Email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Xe
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {reviewData.xe?.TenXe || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Ngày Đánh Giá
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {formatDate(reviewData.NgayDanhGia)}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Đánh Giá Sao
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex justify-center">
                    {renderStarRating(reviewData.SoSao)}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-center">
                    Trạng Thái
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                    {reviewData.AnHien ? "Đã ẩn" : "Hiện thị"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1 text-center">
                  Nội Dung Đánh Giá
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center min-h-32">
                  {reviewData.NoiDung || "Không có nội dung"}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (reviewData) {
                      handleToggleVisibility(reviewData.idDanhGia, reviewData.AnHien);
                      handleModalClose();
                    }
                  }}
                  className={`px-6 py-2 ${reviewData.AnHien ? "bg-green-600" : "bg-yellow-600"} text-white rounded-md hover:${reviewData.AnHien ? "bg-green-700" : "bg-yellow-700"}`}
                >
                  {reviewData.AnHien ? "Hiện Đánh Giá" : "Ẩn Đánh Giá"}
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>

      <div className="w-full">
        <TableDanhGiaTraiNghiem
          onEdit={handleView}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}