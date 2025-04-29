"use client";
import Footer from "@/app/components/Footer";
import { UserAuth } from "@/app/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Toaster } from "react-hot-toast";

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  khachHang: {
    Hoten: string;
    Sdt: string;
    Diachi: string;
  };
}

interface DepositFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  depositAmount: number;
}

interface PickupScheduleData {
  NgayLayXe: Date | null;
  GioHenLayXe: string;
  DiaDiem: string;
}

const Depositpage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [car, setCar] = useState<Car | null>({
    idXe: 1,
    TenXe: "Toyota Camry 2023",
    GiaXe: 100000000,
    khachHang: {
      Hoten: "Nguyễn Văn A",
      Sdt: "0912345678",
      Diachi: "123 Đường Lê Lợi, TP.HCM",
    },
  });

  const [user, setUser] = useState<UserAuth | null>({
    id: "user-123",
    email: "user@example.com",
    name: "Nguyễn Văn A",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickupSchedule, setPickupSchedule] = useState<PickupScheduleData>({
    NgayLayXe: new Date(),
    GioHenLayXe: "10:00",
    DiaDiem: "showroom",
  });

  const [formData, setFormData] = useState<DepositFormData>({
    fullName: "Nguyễn Văn A",
    phoneNumber: "0912345678",
    email: "user@example.com",
    depositAmount: 20000000,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" />
      <div className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="card w-full max-w-2xl bg-slate-200 shadow-xl mt-9">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center justify-center">
              Đặt Cọc Xe {car?.TenXe}
            </h2>
            <p className="text-center text-xl font-semibold text-primary mb-6">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(car.GiaXe)}
            </p>
            <form className="space-y-6">
              <div className="flex justify-between gap-6">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Họ và tên</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      className="input input-bordered bg-slate-300 text-black w-full"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Số điện thoại</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      className="input input-bordered bg-slate-300 text-black w-full"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-6 h-28">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="input input-bordered bg-slate-300 text-black w-full"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Số tiền đặt cọc</span>
                    </label>
                    <input
                      type="number"
                      name="depositAmount"
                      value={formData.depositAmount}
                      className="input input-bordered bg-slate-300 text-black w-full"
                      required
                    />
                    <label className="label">
                      <span className="label-text-alt text-black">
                        Số tiền đặt cọc từ{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Math.round(car.GiaXe * 0.1))}{" "}
                        đến{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Math.round(car.GiaXe * 0.5))}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-6 h-20">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Ngày lấy xe</span>
                    </label>
                    <DatePicker
                      selected={pickupSchedule.NgayLayXe}
                      onChange={(date: Date | null) =>
                        setPickupSchedule((prev) => ({
                          ...prev,
                          NgayLayXe: date,
                        }))
                      }
                      minDate={new Date()}
                      className="input input-bordered bg-slate-300 w-full"
                      placeholderText="Chọn ngày lấy xe"
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Giờ hẹn lấy xe</span>
                    </label>
                    <input
                      type="time"
                      name="GioHenLayXe"
                      value={pickupSchedule.GioHenLayXe}
                      className="input input-bordered bg-slate-300 w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Địa điểm lấy xe</span>
                </label>
                <select
                  name="DiaDiem"
                  value={pickupSchedule.DiaDiem}
                  className="select select-bordered bg-slate-300 text-black w-full"
                  required
                >
                  <option value="">Chọn địa điểm</option>
                  <option value="showroom">Showroom</option>
                  <option value="home">Tại nhà</option>
                  <option value="other">Địa điểm khác</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" className="btn  flex-1">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Đặt cọc
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Depositpage;
