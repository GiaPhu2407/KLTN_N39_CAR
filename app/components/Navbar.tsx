"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Set to null by default, change to mock user data if needed
  
  // Mock data for car categories
  const loaiXe = [
    { id: 1, name: "SUV", brand: "VinFast", image: "/api/placeholder/50/50" },
    { id: 2, name: "Sedan", brand: "VinFast", image: "/api/placeholder/50/50" },
    { id: 3, name: "Hatchback", brand: "VinFast", image: "/api/placeholder/50/50" }
  ];

  // Mock user data - uncomment if you want to simulate a logged-in user
  // const mockUser = {
  //   id: 1,
  //   Hoten: "Nguyễn Văn A",
  //   Email: "nguyenvana@example.com",
  //   Tentaikhoan: "nguyenvana",
  //   Avatar: "/api/placeholder/100/100",
  //   role: { TenNguoiDung: "User" }
  // };
  // setUser(mockUser);

  const handleLogout = () => {
    setUser(null);
    // No need for router.push
  };

  return (
    <div data-theme="light">
      <div className="navbar opacity-90 bg-base-100 shadow-sm fixed z-50">
        <div className="flex px-4 py-2 w-full">
          <Link href="/">
            <Image
              className="ml-2 h-8 w-full hover:scale-105 md:ml-6 md:text-2xl sm:text-2xl"
              alt="VinFast - Thương hiệu xe điện đầu tiên Việt Nam"
              width={200}
              height={200}
              src="https://vinfastauto.com/themes/porto/img/new-home-page/VinFast-logo.svg"
            />
          </Link>

          <div className="justify-start ml-36 xl:flex hidden items-start w-full gap-7">
            <Link href="/">
              <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500">
                Trang Chủ
              </button>
            </Link>
            <ul
              onMouseEnter={() => setIsMenuOpen(true)}
              className="bg-white py-2 font-semibold font-serif transition-all duration-500 text-blue-500 hover:text-red-500 cursor-pointer"
            >
              <li>
                <span>Sản Phẩm</span>
              </li>
            </ul>

            <div
              onMouseLeave={() => setIsMenuOpen(false)}
              className={`absolute z-99 top-16 border-t-2 border-blue-200 left-0 w-full bg-white flex flex-col justify-center items-center gap-10 text-lg border-b-4 shadow-2xl transform transition-all duration-75 ease-in-out ${
                isMenuOpen
                  ? "opacity-100 transform translate-y-0 transition-all duration-1000"
                  : "opacity-0 transform -translate-y-10 pointer-events-none transition-all duration-1000"
              }`}
            >
              <div className="flex flex-col h-5">
                <span className="text-xl font-serif font-bold mt-5 text-blue-600">
                  Danh Sách Loại Xe
                </span>
              </div>
              <div className="flex flex-grow">
                <ul className="flex gap-20 justify-center z-[1] w-full p-2 h-40">
                  {loaiXe.map((loai) => (
                    <li key={loai.id} className="mt-10">
                      <Link href={`LoaiXe?id=${loai.id}`}>
                        <Image
                          src={loai.image}
                          width={100}
                          height={50}
                          className="hover:animate-fadeleft transition-all duration-75 hover:scale-150"
                          alt={loai.name}
                        />
                        <div className="text-center mt-3 font-medium">
                          {loai.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Giới Thiệu
            </button>
            <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Liên Hệ
            </button>
          </div>
        </div>

        <div className="justify-center w-10 md:w-60 items-center mr-4 relative">
          <div className="mb-2">
            {/* <SearchModal /> */}
          </div>
        </div>

        <div className="flex w-full">
          {!user ? (
            <div className="flex w-full gap-2 pt-2 h-14 justify-end">
              <Link
                href="/Login"
                className="btn transition-all border-2 text-center border-b-blue-950 duration-500 bg-white hover:text-red-500 px-1 w-14 h-6 sm:w-20 sm:hidden xl:block sm:h-10"
              >
                Login
              </Link>
              <Link
                href="/Register"
                className="btn transition-all border-2 border-b-blue-950 text-white duration-500 xl:rounded-md hover:text-red-500 bg-blue-600 px-2 w-15 h-6 sm:w-20 sm:hidden xl:block sm:h-10"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex relative">
              <div className="dropdown dropdown-end hidden xl:block">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar flex items-center justify-center"
                >
                  <div
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold leading-none"
                    style={{ lineHeight: "2.5rem" }}
                  >
                   {user.Avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={user.Avatar} 
                        alt="Profile Avatar" 
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm">
                        {user.Hoten ? user.Hoten.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <a href="/Profiles" className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a href="/Depositform">Depositform</a>
                  </li>
                  <li>
                    <a href="/Orders">Orders</a>
                  </li>
                  <li>
                    <a href="/Lichhen">Lịch Hẹn</a>
                  </li>
                  <li>
                    <a href="/Danhgia">Review Car</a>
                  </li>
                  <li>
                    <a href="/Changepassword">Change Password</a>
                  </li>
                  {user.role?.TenNguoiDung === "Admin" && (
                    <li>
                      <a href="/dashboard">Dashboard</a>
                    </li>
                  )}
                  <li className="text-red-500">
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="xl:hidden">
          <button
            className="btn btn-ghost rounded-lg p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 top-3" : "top-1"
                }`}
              ></span>
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 top-3 transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        <div
          className={`fixed xl:hidden top-[4rem] left-0 w-full overflow-y-auto bg-white transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-x-0 opacity-100 shadow-lg"
              : "translate-x-full opacity-0"
          }`}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="flex flex-col h-full">
            <div className="border-t border-gray-200 ml-3 p-4">
              {user ? (
                <div className="flex items-center space-x-3 p-3 w-80 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.Hoten?.[0]?.toUpperCase() ||
                      user?.Tentaikhoan?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user?.Hoten || user?.Tentaikhoan}
                    </p>
                    <p className="text-sm text-gray-500">{user?.Email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/Login"
                    className="btn btn-outline btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/Register"
                    className="btn btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Trang Chủ</span>
              </Link>

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title flex text-base font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10 M7 7h10"
                    />
                  </svg>
                  <span className="font-semibold ml-3 text-gray-700">
                    Sản Phẩm
                  </span>
                </div>
                <div className="collapse-content">
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    {loaiXe.map((loai) => (
                      <Link
                        key={loai.id}
                        href={`LoaiXe?id=${loai.id}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Image
                          src={loai.image}
                          alt={loai.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <span className="font-medium text-gray-700">
                          {loai.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Giới Thiệu</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Liên Hệ</span>
              </Link>
            </div>

            {user && (
              <div className="">
                <ul className="menu menu-lg gap-2 mt-4 h-96 pt-4 font-semibold text-gray-700 text-base border-t">
                  <li>
                    <Link href="/Profiles" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Profile
                      <span className="badge badge-primary badge-sm">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/Depositform" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Depositform
                    </Link>
                  </li>
                  <li>
                    <Link href="/Orders" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Orders
                    </Link>
                  </li>
                  {user.role?.TenNguoiDung === "Admin" && (
                    <li>
                      <Link href="/dashboard" className="text-base" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <a className="text-base" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}