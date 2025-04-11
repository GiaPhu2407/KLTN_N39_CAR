"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { format, addHours } from "date-fns";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
}

interface Xe {
  idXe: number;
  TenXe: string;
}

interface PickupScheduleForm {
  idLichHen?: number;
  TenKhachHang: string;
  Sdt: string;
  Email: string;
  idXe: string;
  idLoaiXe: string;
  NgayHen: Date | null;
  GioHen: string;
  DiaDiem: string;
  NoiDung: string;
  trangThai?: string;
}

interface PickupScheduleFormComponentProps {
  initialData?: PickupScheduleForm;
  onSubmitSuccess?: (newSchedule: any) => void;
}

export const PickupScheduleForm: React.FC<PickupScheduleFormComponentProps> = ({
  initialData = {
    idLichHen: undefined,
    TenKhachHang: "",
    Sdt: "",
    Email: "",
    idXe: "",
    idLoaiXe: "",
    NgayHen: null,
    GioHen: "",
    DiaDiem: "",
    NoiDung: "",
    trangThai: "PENDING",
  },
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<PickupScheduleForm>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaiXeList, setLoaiXeList] = useState<LoaiXe[]>([]);
  const [xeList, setXeList] = useState<Xe[]>([]);

  // Check if form should be disabled (when status is APPROVED)
  const isFormDisabled = initialData?.trangThai === "APPROVED";

  // Fetch Loai Xe and Xe lists
  useEffect(() => {
    Promise.all([
      fetch("/api/loaixe").then((res) => res.json()),
      fetch("/api/xe").then((res) => res.json()),
    ])
      .then(([loaiXeData, xeData]) => {
        setLoaiXeList(loaiXeData);
        setXeList(xeData);
      })
      .catch((err) => {
        console.error("Error fetching lists:", err);
        toast.error("Không thể tải danh sách");
      });
  }, []);

  const handleChange = (e: any) => {
    if (isFormDisabled) return; // Don't allow changes if form is disabled

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "NgayHen" ? new Date(value) : value,
    }));
  };

  // Modify your useEffect to properly format the time when initial data is loaded
  useEffect(() => {
    // Set initial form data with proper time formatting
    if (initialData?.GioHen) {
      const gioHenDate = new Date(initialData.GioHen);
      const formattedTime = format(gioHenDate, "HH:mm");

      setFormData((prev) => ({
        ...initialData,
        GioHen: formattedTime,
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Don't allow submission if form is disabled
    if (isFormDisabled) {
      toast.error("Không thể cập nhật lịch hẹn đã được duyệt");
      return;
    }

    console.log("Initial Data:", initialData);
    console.log("Form Data:", formData);

    // Kiểm tra và log trạng thái update
    const isUpdate = initialData?.idLichHen !== undefined;
    console.log("Is Update:", isUpdate);

    // Validate form data
    const requiredFields = [
      "TenKhachHang",
      "Sdt",
      "Email",
      "idXe",
      "idLoaiXe",
      "NgayHen",
      "GioHen",
      "DiaDiem",
      "NoiDung",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof PickupScheduleForm]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submitData: any = {
        TenKhachHang: formData.TenKhachHang,
        Sdt: formData.Sdt,
        Email: formData.Email,
        idXe: parseInt(formData.idXe),
        idLoaiXe: parseInt(formData.idLoaiXe),
        NgayHen: formData.NgayHen
          ? formData.NgayHen instanceof Date
            ? formData.NgayHen.toISOString()
            : new Date(formData.NgayHen).toISOString()
          : null,
        GioHen:
          formData.NgayHen && formData.GioHen
            ? new Date(
                `${format(formData.NgayHen instanceof Date ? formData.NgayHen : new Date(formData.NgayHen), "yyyy-MM-dd")}T${formData.GioHen}`
              ).toISOString()
            : null,
        DiaDiem: formData.DiaDiem,
        NoiDung: formData.NoiDung,
      };

      // Explicitly add idLichHen if it exists
      if (initialData && initialData.idLichHen) {
        submitData.idLichHen = initialData.idLichHen;
        console.log("Adding idLichHen:", initialData.idLichHen);
      }

      // Determine if this is an update or new schedule
      const isUpdate = !!initialData?.idLichHen;
      const url = isUpdate
        ? `/api/lichhenchaythu/${initialData.idLichHen}`
        : "/api/lichhenchaythu";

      const method = isUpdate ? "PUT" : "POST";

      console.log("Submitting Data:", submitData);
      console.log("Method:", method);
      console.log("URL:", url);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi lưu lịch hẹn");
      }

      const newSchedule = await response.json();

      // Show success toast
      toast.success(
        isUpdate
          ? "Cập nhật lịch hẹn thành công"
          : "Thêm mới lịch hẹn thành công"
      );

      // Call onSubmitSuccess if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(newSchedule);
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-theme="light">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="TenKhachHang" className="block mb-2">
            Tên Khách Hàng
          </label>
          <input
            type="text"
            id="TenKhachHang"
            name="TenKhachHang"
            value={formData.TenKhachHang}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div>
          <label htmlFor="Sdt" className="block mb-2">
            Số Điện Thoại
          </label>
          <input
            type="tel"
            id="Sdt"
            name="Sdt"
            value={formData.Sdt}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="Email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div>
          <label htmlFor="idLoaiXe" className="block mb-2">
            Loại Xe
          </label>
          <select
            id="idLoaiXe"
            name="idLoaiXe"
            value={formData.idLoaiXe}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={isFormDisabled}
          >
            <option value="">Chọn Loại Xe</option>
            {loaiXeList.map((loaiXe) => (
              <option key={loaiXe.idLoaiXe} value={loaiXe.idLoaiXe}>
                {loaiXe.TenLoai}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="idXe" className="block mb-2">
            Xe
          </label>
          <select
            id="idXe"
            name="idXe"
            value={formData.idXe}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
            disabled={isFormDisabled}
          >
            <option value="">Chọn Xe</option>
            {xeList.map((xe) => (
              <option key={xe.idXe} value={xe.idXe}>
                {xe.TenXe}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="NgayHen" className="block mb-2">
            Ngày Hẹn
          </label>
          <input
            type="date"
            id="NgayHen"
            name="NgayHen"
            value={
              formData.NgayHen ? format(formData.NgayHen, "yyyy-MM-dd") : ""
            }
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="GioHen" className="block mb-2">
            Giờ Hẹn
          </label>
          <input
            type="time"
            id="GioHen"
            name="GioHen"
            value={formData.GioHen || ""}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div>
          <label htmlFor="DiaDiem" className="block mb-2">
            Địa Điểm
          </label>
          <input
            type="text"
            id="DiaDiem"
            name="DiaDiem"
            value={formData.DiaDiem}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div>
        <label htmlFor="NoiDung" className="block mb-2">
          Nội Dung
        </label>
        <textarea
          id="NoiDung"
          name="NoiDung"
          value={formData.NoiDung}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          required
          disabled={isFormDisabled}
        />
      </div>
      <div></div>

      <div className="form-control mt-4">
        {!isFormDisabled && (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang Lưu..."
              : initialData?.idLichHen !== undefined
                ? "Cập Nhật"
                : "Thêm Mới"}
          </button>
        )}
        {isFormDisabled && (
          <div className="p-3 bg-gray-100 text-center rounded-md">
            Lịch hẹn đã được duyệt không thể chỉnh sửa
          </div>
        )}
      </div>
    </form>
  );
};
