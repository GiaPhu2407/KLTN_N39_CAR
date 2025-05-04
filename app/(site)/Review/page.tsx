"use client";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";

interface LichHen {
  idLichHen: number;
  TenKhachHang: string;
  Sdt: string;
  Email: string;
  GioHen: string;
  NgayHen: string;
  DiaDiem: string;
  NoiDung: string;
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

// Dữ liệu giả cho lịch hẹn
// Dữ liệu giả cho lịch hẹn
const mockLichHens: LichHen[] = [
  {
    idLichHen: 1001,
    TenKhachHang: "Nguyễn Văn An",
    Sdt: "0912345678",
    Email: "vanan@email.com",
    GioHen: "2025-05-01T09:00:00",
    NgayHen: "2025-05-01",
    DiaDiem: "Showroom Quận 1, TP.HCM",
    NoiDung: "Tôi muốn trải nghiệm tốc độ và cảm giác lái",
    xe: {
      idXe: 101,
      TenXe: "Vinfast VF3",
      HinhAnh: "https://example.com/camry.jpg",
      GiaXe: 1350000000,
      MauSac: "Đen ánh kim",
      DongCo: "2.5L, 4 xi-lanh",
    },
    loaiXe: {
      TenLoai: "Sedan",
      NhanHieu: "Toyota",
    },
  },
  {
    idLichHen: 1002,
    TenKhachHang: "Trần Thị Bình",
    Sdt: "0923456789",
    Email: "tranbinh@email.com",
    GioHen: "2025-04-28T14:30:00",
    NgayHen: "2025-04-28",
    DiaDiem: "Showroom Quận 7, TP.HCM",
    NoiDung: "Quan tâm đến khả năng vận hành và tiết kiệm nhiên liệu",
    xe: {
      idXe: 102,
      TenXe: "Vinfast VF5",
      HinhAnh: "https://example.com/crv.jpg",
      GiaXe: 1100000000,
      MauSac: "Trắng ngọc trai",
      DongCo: "1.5L, Turbo",
    },
    loaiXe: {
      TenLoai: "SUV",
      NhanHieu: "Honda",
    },
  },
  {
    idLichHen: 1003,
    TenKhachHang: "Lê Hoàng Cường",
    Sdt: "0934567890",
    Email: "hoangcuong@email.com",
    GioHen: "2025-04-25T10:15:00",
    NgayHen: "2025-04-25",
    DiaDiem: "Showroom Quận 2, TP.HCM",
    NoiDung: "Muốn thử xe gia đình rộng rãi",
    xe: {
      idXe: 103,
      TenXe: "Vinfast VF7",
      HinhAnh: "https://example.com/everest.jpg",
      GiaXe: 1299000000,
      MauSac: "Xanh đậm",
      DongCo: "2.0L, Bi-Turbo",
    },
    loaiXe: {
      TenLoai: "SUV",
      NhanHieu: "Ford",
    },
  },
  {
    idLichHen: 1004,
    TenKhachHang: "Phạm Minh Dũng",
    Sdt: "0945678901",
    Email: "minhdung@email.com",
    GioHen: "2025-04-20T15:45:00",
    NgayHen: "2025-04-20",
    DiaDiem: "Showroom Quận 10, TP.HCM",
    NoiDung: "",
    xe: {
      idXe: 104,
      TenXe: "Vinfast VF9",
      HinhAnh: "https://example.com/cx5.jpg",
      GiaXe: 899000000,
      MauSac: "Đỏ pha lê",
      DongCo: "2.5L, Skyactiv",
    },
    loaiXe: {
      TenLoai: "Crossover",
      NhanHieu: "Mazda",
    },
  },
];

// Dữ liệu giả cho đánh giá
const mockDanhGias: DanhGiaTraiNghiem[] = [
  {
    idDanhGia: 501,
    idLichHen: 1002,
    idUser: 201,
    idXe: 102,
    SoSao: 5,
    NoiDung:
      "Trải nghiệm tuyệt vời! Honda CRV có khả năng vận hành êm ái, tiết kiệm nhiên liệu như mong đợi. Không gian nội thất rộng rãi và sang trọng. Hệ thống giải trí hiện đại và dễ sử dụng. Chắc chắn sẽ mua xe này.",
    NgayDanhGia: "2025-04-29",
  },
  {
    idDanhGia: 502,
    idLichHen: 1003,
    idUser: 202,
    idXe: 103,
    SoSao: 4,
    NoiDung:
      "Ford Everest có không gian rộng rãi, phù hợp với gia đình đông người. Xe vận hành mạnh mẽ trên đường trường nhưng hơi cứng khi đi trong phố. Trang bị an toàn rất tốt.",
    NgayDanhGia: "2025-04-26",
  },
];

const TestDriveReviewPage = () => {
  const [lichHens, setLichHens] = useState<LichHen[]>([]);
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
  const [rating, setRating] = useState<DanhGia>({
    idLichHen: 0,
    SoSao: 0,
    NoiDung: "",
  });
  // Add pagination states
  const [displayedLichHens, setDisplayedLichHens] = useState<LichHen[]>([]);
  const lichHensPerPage = 2;

  // Thiết lập dữ liệu giả
  useEffect(() => {
    // Giả lập việc tải dữ liệu
    setTimeout(() => {
      setLichHens(mockLichHens);
      setDisplayedLichHens(mockLichHens.slice(0, lichHensPerPage));

      // Chuyển mảng đánh giá thành object với key là idLichHen
      const ratingsMap: { [key: number]: DanhGiaTraiNghiem } = {};
      mockDanhGias.forEach((danhGia: DanhGiaTraiNghiem) => {
        ratingsMap[danhGia.idLichHen] = danhGia;
      });
      setDanhGias(ratingsMap);

      setLoading(false);
    }, 800); // Giả lập thời gian tải 800ms
  }, []);

  const handleRatingChange = (newRating: number) => {
    setRating({ ...rating, SoSao: newRating });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRating({ ...rating, NoiDung: e.target.value });
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

  const submitRating = () => {
    if (rating.SoSao === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    // Giả lập gửi đánh giá thành công
    toast.success("Đánh giá thành công");
    closeRatingModal();

    // Tạo đánh giá mới và thêm vào state
    const newRating: DanhGiaTraiNghiem = {
      idDanhGia: Math.floor(Math.random() * 1000) + 503, // ID ngẫu nhiên
      idLichHen: rating.idLichHen,
      idUser: Math.floor(Math.random() * 100) + 200, // ID user ngẫu nhiên
      idXe:
        lichHens.find((lh) => lh.idLichHen === rating.idLichHen)?.xe.idXe || 0,
      SoSao: rating.SoSao,
      NoiDung: rating.NoiDung,
      NgayDanhGia: new Date().toISOString().split("T")[0],
    };

    // Cập nhật state danhGias
    setDanhGias((prev) => ({
      ...prev,
      [rating.idLichHen]: newRating,
    }));
  };

  // Format datetime to Vietnamese format
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

  // Load more function
  const loadMore = () => {
    const currentLength = displayedLichHens.length;
    const newItems = lichHens.slice(
      currentLength,
      currentLength + lichHensPerPage
    );
    setDisplayedLichHens((prevItems) => [...prevItems, ...newItems]);
  };

  // Show less function
  const showLess = () => {
    setDisplayedLichHens(lichHens.slice(0, lichHensPerPage));
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
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
    <div data-theme="light">
      <Toaster position="top-center" />

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Đánh giá trải nghiệm lái thử: {ratingModal.carName}
            </h3>

            <div className="flex flex-col items-center mb-4">
              <p className="text-lg font-medium mb-2">
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
              className="w-full p-3 border rounded-md mb-4 min-h-[100px]"
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

      {/* View Rating Modal - Fixed null check issue */}
      {viewRatingModal.isOpen && viewRatingModal.rating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Đánh giá của bạn</h3>

            <div className="flex justify-center mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-8 h-8"
                    fill={
                      viewRatingModal.rating &&
                      viewRatingModal.rating.SoSao >= star
                        ? "#FFD700"
                        : "#D1D5DB"
                    }
                    stroke="#000000"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ))}
              </div>
            </div>

            <div className="p-3 border rounded-md mb-4 min-h-[100px] bg-gray-50">
              {viewRatingModal.rating.NoiDung}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Đánh giá vào:{" "}
              {new Date(viewRatingModal.rating.NgayDanhGia).toLocaleDateString(
                "vi-VN"
              )}
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={closeViewRatingModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-14 py-28">
        <h1 className="text-2xl font-bold mb-6">Lịch sử lái thử xe</h1>

        {lichHens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Bạn chưa đặt lịch lái thử xe nào
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap flex-shrink justify-stretch gap-12">
              {displayedLichHens.map((lichHen) => (
                <div
                  key={lichHen.idLichHen}
                  className="bg-white rounded-2xl shadow-xl p-6 space-y-4 w-full md:w-[calc(50%-1.5rem)]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Mã lịch hẹn: </span>
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
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                      >
                        Xem đánh giá
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openRatingModal(lichHen.idLichHen, lichHen.xe.TenXe)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
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
                  className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                >
                  Xem thêm
                </button>
              )}
              {displayedLichHens.length > lichHensPerPage && (
                <button
                  onClick={showLess}
                  className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
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
