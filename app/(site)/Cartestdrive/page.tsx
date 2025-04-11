"use client";
import { UserAuth } from "@/app/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  idLoaiXe: number;
  khachHang: {
    Hoten: string;
    Sdt: string;
    Diachi: string;
  };
}

interface AppointmentFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  notes: string;
}

interface TestDriveScheduleData {
  NgayHen: Date | null;
  GioHen: string;
  DiaDiem: string;
}

const CartTestDrivePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testDriveSchedule, setTestDriveSchedule] =
    useState<TestDriveScheduleData>({
      NgayHen: null,
      GioHen: "",
      DiaDiem: "",
    });
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestDriveScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTestDriveSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Toaster position="top-right" />
      <div className="flex-1 flex justify-center items-center py-12 px-4 w-full">
        <div className="w-full md:w-[900px] lg:w-[1200px] bg-slate-200 shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Đặt Lịch Trải Nghiệm Xe
          </h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex justify-center items-center">
              <img
                src="/images/vinfast/blue/1.png"
                alt="Ảnh xe"
                className="w-full h-auto max-w-[500px]"
              />
            </div>
            <div className="flex-1">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      className="input input-bordered bg-slate-300 text-black w-full mt-2"
                      placeholder="Nhập họ và tên"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      className="input input-bordered bg-slate-300 text-black w-full mt-2"
                      placeholder="Nhập số điện thoại"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="input input-bordered bg-slate-300 text-black w-full mt-2"
                      placeholder="Nhập email"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium">
                      Ngày hẹn
                    </label>
                    <DatePicker
                      selected={testDriveSchedule.NgayHen}
                      onChange={(date: Date | null) =>
                        setTestDriveSchedule((prev) => ({
                          ...prev,
                          NgayHen: date,
                        }))
                      }
                      minDate={new Date()}
                      className="input input-bordered bg-slate-300 w-full mt-2"
                      placeholderText="Chọn ngày hẹn"
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium">Giờ hẹn</label>
                    <input
                      type="time"
                      name="GioHen"
                      value={testDriveSchedule.GioHen}
                      onChange={handleTestDriveScheduleChange}
                      className="input input-bordered bg-slate-300 w-full mt-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium">
                      Địa điểm trải nghiệm
                    </label>
                    <select
                      name="DiaDiem"
                      value={testDriveSchedule.DiaDiem}
                      onChange={handleTestDriveScheduleChange}
                      className="select select-bordered bg-slate-300 text-black w-full mt-2"
                      required
                    >
                      <option value="">Chọn địa điểm</option>
                      <option value="showroom">Tại Showroom</option>
                      <option value="home">Tại Nhà</option>
                      <option value="other">Địa điểm khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered bg-slate-300 text-black w-full mt-2 h-24"
                    placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt"
                  ></textarea>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    // onClick={() => router.push(`/Carcategory?id=${car.idXe}`)}
                    className="btn flex-1 bg-gray-400 hover:bg-gray-500 text-white"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Đặt lịch hẹn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTestDrivePage;
