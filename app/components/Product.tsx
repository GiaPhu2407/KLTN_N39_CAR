"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CarItem = ({ car, category }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <div
        className={`card bg-base-100 w-full sm:w-[90%] md:w-72 xl:w-72 h-auto md:h-80 xl:h-80 mx-auto md:ml-6 mb-5 shadow-sm relative ${
          isHovered ? "animate-borderrun" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute bg-gradient-to-bl from-orange-600 to-orange-400 w-full sm:w-[303px] h-full sm:h-[335px] z-[-1] -top-2 -left-2 rounded-2xl ${
            isHovered ? "animate-spinrun" : "hidden"
          }`}
        ></div>
        <div className="w-full sm:w-[303px] h-auto sm:h-[303px] p-4 sm:p-0">
          <figure className="px-4 sm:px-10 w-full">
            <Image
              src={
                Array.isArray(car.HinhAnh)
                  ? car.HinhAnh[0]
                  : car.HinhAnh.split("|")[0]
              }
              alt={car.TenXe}
              width={100}
              height={100}
              className="rounded-xl w-full sm:w-64 h-auto sm:h-32 object-cover"
            />
          </figure>
          <div className="card-body items-center text-center p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
              <h2 className="card-title text-lg sm:text-xl w-full">{car.TenXe}</h2>
              {category && (
                <p className="text-gray-600 text-sm sm:text-base">{category.TenLoai}</p>
              )}
            </div>
            
            <p className="flex justify-start w-full mt-2">
              <span className="text-purple-600 text-xl sm:text-2xl font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(car.GiaXe)}
              </span>
            </p>
            <div className="card-actions flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-2">
              <button className="btn bg-[#1464F4] w-full sm:w-24 text-white text-sm">
                <Link href={`Datcoc?id=${car.idXe}`}>Đặt Cọc</Link>
              </button>
              <Link
                href={`Carcategory?id=${car.idXe}`}
                className="btn btn-outline w-full sm:w-auto text-sm"
              >
                Xem Chi Tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const Product = () => {
  // Mock data for demo purposes
  const mockCars = [
    {
      idXe: 1,
      TenXe: "VF 8",
      GiaXe: 1200000000,
      MauSac: "Đen",
      DongCo: "Điện",
      TrangThai: "Còn hàng",
      HinhAnh: "",
      NamSanXuat: "2023",
      idLoaiXe: 1
    },
    {
      idXe: 2,
      TenXe: "VF 9",
      GiaXe: 1500000000,
      MauSac: "Trắng",
      DongCo: "Điện",
      TrangThai: "Còn hàng",
      HinhAnh: "",
      NamSanXuat: "2023",
      idLoaiXe: 2
    }
  ];

  const mockCategories = [
    {
      idLoaiXe: 1,
      TenLoai: "SUV",
      NhanHieu: "VinFast",
      HinhAnh: ""
    },
    {
      idLoaiXe: 2,
      TenLoai: "Sedan",
      NhanHieu: "VinFast",
      HinhAnh: ""
    }
  ];

  const [cars] = useState(mockCars);
  const [categories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayedCars, setDisplayedCars] = useState(mockCars.slice(0, 4));
  const carsPerPage = 4;

  const loadMore = () => {
    const currentLength = displayedCars.length;
    const filteredCars = selectedCategory
      ? cars.filter(car => car.idLoaiXe === selectedCategory)
      : cars;
    const newCars = filteredCars.slice(currentLength, currentLength + carsPerPage);
    setDisplayedCars([...displayedCars, ...newCars]);
  };

  const showLess = () => {
    setDisplayedCars(displayedCars.slice(0, carsPerPage));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const filteredCars = categoryId
      ? cars.filter(car => car.idLoaiXe === categoryId)
      : cars;
    setDisplayedCars(filteredCars.slice(0, carsPerPage));
  };

  const getCategoryById = (categoryId) => {
    return categories.find(category => category.idLoaiXe === categoryId);
  };

  return (
    <div className="w-full h-full flex flex-col" data-theme="light">
      <div className="px-4 sm:px-6 xl:mx-20 md:mx-10 mt-16 sm:mt-24">
        <br />
        <div className="border-b-4 border-blue-500 mt-3 sm:mt-5"></div>

        <div className="mt-6 h-12 sm:mt-8 mb-6 sm:mb-8 overflow-x-auto animate-appear [animation-timeline:view()] animation-range-entry">
          <div className="flex flex-nowrap sm:flex-wrap gap-4 text-2xl sm:text-3xl h-9 min-w-max sm:min-w-0 sm:justify-between pb-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`${!selectedCategory ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'} 
                whitespace-nowrap hover:border-b-2 border-blue-500 hover:text-blue-500 italic font-bold px-2`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.idLoaiXe}
                onClick={() => handleCategorySelect(category.idLoaiXe)}
                className={`${selectedCategory === category.idLoaiXe ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'} 
                  whitespace-nowrap hover:border-b-2 border-blue-500 hover:text-blue-500 italic font-bold px-2`}
              >
                {category.TenLoai}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:flex sm:flex-wrap w-full mt-8 sm:mt-12 gap-4 sm:gap-4 xl:gap-1 min-[1920px]:gap-32 xl:animate-appear px-5  sm:px-2">
          {displayedCars.map((car) => (
            <CarItem 
              key={car.idXe} 
              car={car}
              category={getCategoryById(car.idLoaiXe)}
            />
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 px-4 sm:px-0">
          {displayedCars.length < cars.length && (
            <button
              onClick={loadMore}
              className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
            >
              Load more
            </button>
          )}
          {displayedCars.length > carsPerPage && (
            <button
              onClick={showLess}
              className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;