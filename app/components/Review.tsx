"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";

interface LichHenTraiNghiem {
  idLichHen: number;
  TenKhachHang: string;
  Sdt: string;
  Email: string;
  GioHen: string;
  NgayHen: string;
  DiaDiem: string;
  NoiDung: string;
  trangThai: string;
  xe: {
    idXe: number;
    TenXe: string;
    HinhAnh: string;
    GiaXe: number;
    MauSac: string;
    DongCo: string;
  };
  loaiXe: {
    TenLoai: string;
    NhanHieu: string;
  };
}

interface DanhGia {
  idLichHen: number;
  SoSao: number;
  NoiDung: string;
}

interface DanhGiaTraiNghiem {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number;
  NoiDung: string;
  HinhAnh?: string;
  NgayDanhGia: string;
}

const TestDriveReviewPage = () => {
  const [lichHens, setLichHens] = useState<LichHenTraiNghiem[]>([]);
  const [danhGias, setDanhGias] = useState<{
    [key: number]: DanhGiaTraiNghiem;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    lichHenId: number | null;
    carName: string;
  }>({
    isOpen: false,
    lichHenId: null,
    carName: "",
  });
  const [viewRatingModal, setViewRatingModal] = useState<{
    isOpen: boolean;
    rating: DanhGiaTraiNghiem | null;
  }>({
    isOpen: false,
    rating: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ratingId: number | null;
  }>({
    isOpen: false,
    ratingId: null,
  });
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    rating: DanhGiaTraiNghiem | null;
  }>({
    isOpen: false,
    rating: null,
  });
  const [rating, setRating] = useState<DanhGia>({
    idLichHen: 0,
    SoSao: 0,
    NoiDung: "",
  });
  const [updateRating, setUpdateRating] = useState<{
    idDanhGia: number;
    SoSao: number;
    NoiDung: string;
  }>({
    idDanhGia: 0,
    SoSao: 0,
    NoiDung: "",
  });
  const [displayedLichHens, setDisplayedLichHens] = useState<
    LichHenTraiNghiem[]
  >([]);
  const lichHensPerPage = 2;

  // Prevent page scrolling when modals are open
  useEffect(() => {
    if (
      ratingModal.isOpen ||
      viewRatingModal.isOpen ||
      deleteModal.isOpen ||
      updateModal.isOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [ratingModal.isOpen, viewRatingModal.isOpen, deleteModal.isOpen, updateModal.isOpen]);

  useEffect(() => {
    fetchLichHens();
    fetchDanhGias();
  }, []);

  const fetchLichHens = async () => {
    try {
      const response = await fetch("/api/testdriveappointment");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Filter only COMPLETED appointments
      const completedLichHens = data.filter((lichHen: LichHenTraiNghiem) => 
        lichHen.trangThai === "COMPLETED"
      );
      
      setLichHens(completedLichHens);
      setDisplayedLichHens(completedLichHens.slice(0, lichHensPerPage));
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      setError("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhGias = async () => {
    try {
      const response = await fetch("/api/review");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const ratingsMap: { [key: number]: DanhGiaTraiNghiem } = {};
      data.forEach((danhGia: DanhGiaTraiNghiem) => {
        ratingsMap[danhGia.idLichHen] = danhGia;
      });

      setDanhGias(ratingsMap);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating({ ...rating, SoSao: newRating });
  };

  const handleUpdateRatingChange = (newRating: number) => {
    setUpdateRating({ ...updateRating, SoSao: newRating });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRating({ ...rating, NoiDung: e.target.value });
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateRating({ ...updateRating, NoiDung: e.target.value });
  };

  const openRatingModal = (lichHenId: number, carName: string) => {
    setRatingModal({
      isOpen: true,
      lichHenId,
      carName,
    });
    setRating({
      idLichHen: lichHenId,
      SoSao: 0,
      NoiDung: "",
    });
  };

  const closeRatingModal = () => {
    setRatingModal({
      isOpen: false,
      lichHenId: null,
      carName: "",
    });
  };

  const openViewRatingModal = (rating: DanhGiaTraiNghiem) => {
    setViewRatingModal({
      isOpen: true,
      rating,
    });
  };

  const closeViewRatingModal = () => {
    setViewRatingModal({
      isOpen: false,
      rating: null,
    });
  };

  const openDeleteModal = (ratingId: number) => {
    setDeleteModal({
      isOpen: true,
      ratingId,
    });
    closeViewRatingModal();
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      ratingId: null,
    });
  };

  const openUpdateModal = (rating: DanhGiaTraiNghiem) => {
    setUpdateModal({
      isOpen: true,
      rating,
    });
    setUpdateRating({
      idDanhGia: rating.idDanhGia,
      SoSao: rating.SoSao,
      NoiDung: rating.NoiDung || "",
    });
    closeViewRatingModal();
  };

  const closeUpdateModal = () => {
    setUpdateModal({
      isOpen: false,
      rating: null,
    });
  };

  const submitRating = async () => {
    if (rating.SoSao === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rating),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Đánh giá thành công");
      closeRatingModal();
      await fetchDanhGias();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Không thể gửi đánh giá");
    }
  };

  const deleteRating = async () => {
    if (!deleteModal.ratingId) return;
    
    try {
      const response = await fetch(`/api/review/${deleteModal.ratingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Đã xóa đánh giá thành công");
      closeDeleteModal();
      
      // Update the local state
      await fetchDanhGias();
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Không thể xóa đánh giá");
    }
  };

  const updateRatingSubmit = async () => {
    if (updateRating.SoSao === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      const response = await fetch(`/api/review/${updateRating.idDanhGia}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SoSao: updateRating.SoSao,
          NoiDung: updateRating.NoiDung,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Cập nhật đánh giá thành công");
      closeUpdateModal();
      await fetchDanhGias();
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Không thể cập nhật đánh giá");
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const loadMore = () => {
    const currentLength = displayedLichHens.length;
    const newItems = lichHens.slice(
      currentLength,
      currentLength + lichHensPerPage
    );
    setDisplayedLichHens((prevItems) => [...prevItems, ...newItems]);
  };

  const showLess = () => {
    setDisplayedLichHens(lichHens.slice(0, lichHensPerPage));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="bg-white text-black"
      style={{ backgroundColor: "white", color: "black" }}
    >

      {/* Rating Modal - Custom styled */}
      {ratingModal.isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md m-4"
            style={{
              backgroundColor: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-bold mb-4 text-black"
              style={{ color: "black" }}
            >
              Đánh giá trải nghiệm lái thử: {ratingModal.carName}
            </h3>

            <div className="flex flex-col items-center mb-4">
              <p
                className="text-lg font-medium mb-2 text-black"
                style={{ color: "black" }}
              >
                Mức độ hài lòng của bạn
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className="w-10 h-10"
                      fill={rating.SoSao >= star ? "#FFD700" : "#D1D5DB"}
                      stroke="#000000"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2 h-5">
                {rating.SoSao === 0 && "Vui lòng chọn mức độ hài lòng"}
                {rating.SoSao === 1 && "Rất không hài lòng"}
                {rating.SoSao === 2 && "Không hài lòng"}
                {rating.SoSao === 3 && "Bình thường"}
                {rating.SoSao === 4 && "Hài lòng"}
                {rating.SoSao === 5 && "Rất hài lòng"}
              </div>
            </div>

            <textarea
              className="w-full p-3 border rounded-md mb-4 min-h-[100px] text-black"
              style={{ color: "black", backgroundColor: "white" }}
              placeholder="Chia sẻ cảm nhận của bạn về trải nghiệm lái thử xe..."
              value={rating.NoiDung}
              onChange={handleInputChange}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={closeRatingModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={submitRating}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Rating Modal with DaisyUI */}
      {viewRatingModal.isOpen && viewRatingModal.rating && (
        <dialog open className="modal modal-bottom sm:modal-middle bg-white">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-lg mb-4">Đánh giá của bạn</h3>
            
            <div className="flex justify-center mb-4">
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input 
                    key={star}
                    type="radio" 
                    name="rating-view" 
                    className={`mask mask-star-2 ${viewRatingModal.rating && viewRatingModal.rating.SoSao >= star ? 'bg-yellow-400' : 'bg-gray-300'}`}
                    checked={viewRatingModal.rating && viewRatingModal.rating.SoSao === star}
                    readOnly
                  />
                ))}
              </div>
            </div>

            <div className="p-3 border rounded-md mb-4 min-h-[100px] bg-gray-50 text-black overflow-y-auto">
              {viewRatingModal.rating.NoiDung}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Đánh giá vào:{" "}
              {new Date(viewRatingModal.rating.NgayDanhGia).toLocaleDateString("vi-VN")}
            </p>

            <div className="modal-action">
              <button 
                className="btn btn-error"
                onClick={() => openDeleteModal(viewRatingModal.rating!.idDanhGia)}
              >
                Xóa đánh giá
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => openUpdateModal(viewRatingModal.rating!)}
              >
                Chỉnh sửa
              </button>
              <button 
                className="btn btn-primary"
                onClick={closeViewRatingModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Delete Confirmation Modal with DaisyUI */}
      {deleteModal.isOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle bg-white">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-lg text-error">Xác nhận xóa đánh giá</h3>
            <p className="py-4">Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.</p>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={closeDeleteModal}>Hủy</button>
              <button className="btn btn-error" onClick={deleteRating}>Xóa</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Update Rating Modal with DaisyUI */}
      {updateModal.isOpen && updateModal.rating && (
        <dialog open className="modal modal-bottom sm:modal-middle bg-white">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-lg mb-4">Cập nhật đánh giá</h3>
            
            <div className="flex flex-col items-center mb-4">
              <p className="font-medium mb-2">Mức độ hài lòng của bạn</p>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input 
                    key={star}
                    type="radio" 
                    name="rating-update" 
                    className="mask mask-star-2 bg-yellow-400"
                    checked={updateRating.SoSao === star}
                    onChange={() => handleUpdateRatingChange(star)}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2 h-5">
                {updateRating.SoSao === 0 && "Vui lòng chọn mức độ hài lòng"}
                {updateRating.SoSao === 1 && "Rất không hài lòng"}
                {updateRating.SoSao === 2 && "Không hài lòng"}
                {updateRating.SoSao === 3 && "Bình thường"}
                {updateRating.SoSao === 4 && "Hài lòng"}
                {updateRating.SoSao === 5 && "Rất hài lòng"}
              </div>
            </div>

            <textarea
              className="textarea textarea-bordered w-full mb-4 min-h-[100px] bg-white"
              placeholder="Chia sẻ cảm nhận của bạn về trải nghiệm lái thử xe..."
              value={updateRating.NoiDung}
              onChange={handleUpdateInputChange}
            ></textarea>

            <div className="modal-action">
              <button className="btn btn-outline" onClick={closeUpdateModal}>Hủy</button>
              <button className="btn btn-primary" onClick={updateRatingSubmit}>Cập nhật đánh giá</button>
            </div>
          </div>
        </dialog>
      )}

      <div className="container mx-auto px-4 md:px-14 py-28">
        <h1 className="text-2xl font-bold mb-6">Đánh giá trải nghiệm xe</h1>

        {lichHens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Bạn chưa có đánh giá nào
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap flex-shrink justify-stretch gap-4 md:gap-12">
              {displayedLichHens.map((lichHen) => (
                <div
                  key={lichHen.idLichHen}
                  className="bg-white rounded-2xl shadow-xl p-6 space-y-4 w-full md:w-[calc(50%-1.5rem)]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Mã đánh giá: </span>
                      <span className="font-semibold">
                        #{lichHen.idLichHen}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t pt-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={lichHen.xe.HinhAnh}
                        alt={lichHen.xe.TenXe}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {lichHen.xe.TenXe}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Loại xe: <span>{lichHen.loaiXe.TenLoai}</span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Hãng xe: <span>{lichHen.loaiXe.NhanHieu}</span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Màu sắc: <span>{lichHen.xe.MauSac}</span>
                      </p>
                      <p className="text-gray-600">
                        Động cơ: <span>{lichHen.xe.DongCo}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Ngày hẹn:</span>{" "}
                        {new Date(lichHen.NgayHen).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Giờ hẹn:</span>{" "}
                        {formatDateTime(lichHen.GioHen)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Địa điểm:</span>{" "}
                        {lichHen.DiaDiem}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Khách hàng:</span>{" "}
                        {lichHen.TenKhachHang}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Số điện thoại:</span>{" "}
                        {lichHen.Sdt}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {lichHen.Email}
                      </p>
                    </div>
                  </div>

                  {lichHen.NoiDung && (
                    <div className="border-t pt-4">
                      <p className="text-gray-600 font-medium">Ghi chú:</p>
                      <p className="text-gray-800">{lichHen.NoiDung}</p>
                    </div>
                  )}

                  <div className="flex justify-end items-center gap-4 border-t pt-4">
                    {danhGias[lichHen.idLichHen] ? (
                      <button
                        onClick={() =>
                          openViewRatingModal(danhGias[lichHen.idLichHen])
                        }
                        className="btn btn-success"
                      >
                        Xem đánh giá
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openRatingModal(lichHen.idLichHen, lichHen.xe.TenXe)
                        }
                        className="btn btn-primary"
                      >
                        Đánh giá trải nghiệm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More / Show Less Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 px-4 sm:px-0 mt-8 w-full">
              {displayedLichHens.length < lichHens.length && (
                <button
                  onClick={loadMore}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Xem thêm
                </button>
              )}
              {displayedLichHens.length > lichHensPerPage && (
                <button
                  onClick={showLess}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Thu gọn
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TestDriveReviewPage;