"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/components/Footer";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import CarReviews from "@/app/components/CarReviews";

interface Car {
  idXe: number;
  currentStock: number;
  TenXe: string;
  GiaXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string | string[];
  NamSanXuat: string;
  ThongSoKyThuat: string;
  MoTa: string;
  loaiXe: {
    TenLoai: string;
    NhanHieu: string;
  };
}

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (id) {
      fetch(`/api/car/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setCar(data);

          // Parse the images
          let imageArray: string[] = [];
          if (typeof data.HinhAnh === "string") {
            // Split by either comma or pipe
            imageArray = data.HinhAnh.split(/[,|]/)
              .map((url: string) => url.trim())
              .filter(Boolean);
          } else if (Array.isArray(data.HinhAnh)) {
            imageArray = data.HinhAnh;
          }
          setImages(imageArray);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin xe:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );

  if (!car)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-800">
          Không tìm thấy thông tin xe
        </div>
      </div>
    );
  const isCarAvailable = car.TrangThai === "Còn Hàng";
  const isCarReserved = car.TrangThai === "Đã Đặt Cọc";
  return (
    <div className="w-full h-full pt-24" data-theme="light">
      <div className="px-24 pb-24 w-full h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-8">Chi tiết sản phẩm</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 xl:w-[600px] xl:h-[500px] relative">
              {images.length > 0 && (
                <img
                  className="xl:h-[500px] xl:w-full object-cover md:w-48"
                  src={images[currentImageIndex]}
                  alt={car.TenXe}
                />
              )}
            </div>
            <div className="flex flex-col ml-8">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`w-24 h-24 relative cursor-pointer border-2 ${
                    index === currentImageIndex
                      ? "border-indigo-500"
                      : "border-transparent"
                  } hover:border-indigo-500`}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`${car.TenXe} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col ml-16 w-full h-full">
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {car.loaiXe?.NhanHieu || "Không rõ nhãn hiệu"}
                </div>
                <h2 className="block mt-1 text-3xl leading-tight font-bold text-black">
                  {car.TenXe}
                </h2>
                <p className="mt-2 text-gray-500">
                  {car.loaiXe?.TenLoai || "Không rõ loại xe"}
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mt-3">
                  Mô Tả
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center">
                    <span>{car.MoTa}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">
                      Động cơ:
                    </span>
                    <span>{car.DongCo}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">
                      Màu sắc:
                    </span>
                    <span>{car.MauSac}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">
                      Năm sản xuất:
                    </span>
                    <span>{car.NamSanXuat}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium text-gray-600 mr-2">
                      Trạng thái:
                    </span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        car.TrangThai === "Còn hàng"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {car.TrangThai}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="ml-8 flex flex-col gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    Giá bán:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(car.GiaXe)}
                  </p>
                  <div className="flex mt-4">
                    {isCarAvailable ? (
                      <button className="w-48 bg-indigo-600 text-white py-2 mx-4 rounded-md hover:bg-indigo-700 transition duration-300">
                        <Link href={`/Deposit?id=${car.idXe}`}>Đặt Cọc</Link>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-48 bg-gray-400 text-white py-2 mx-4 rounded-md cursor-not-allowed"
                      >
                        {isCarReserved ? "Đã đặt cọc" : "Không thể đặt cọc"}
                      </button>
                    )}

                    <button
                      className={`w-52 ${
                        isCarAvailable
                          ? "bg-slate-300 hover:bg-slate-400"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-black py-2 px-1 mx-4 rounded-md transition duration-300`}
                    >
                      <Link href={`/Cartestdrive?id=${car.idXe}`}>
                        Đặt Lịch Hẹn Trải Nghiệm
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="mt-8 bg-blue-100 shadow-xl rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-6">Thông Số Kỹ Thuật</h2>
          <div className="mt-6">
            <div className="whitespace-pre-line">{car.ThongSoKyThuat}</div>
          </div>
        </div>
        <CarReviews idXe={car.idXe} />
      </div>
      <Footer />
    </div>
  );
};

export default Category;
