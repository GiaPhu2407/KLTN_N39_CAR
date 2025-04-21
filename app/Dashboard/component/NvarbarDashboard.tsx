import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { UserAuth } from "@/app/types/auth";

interface CartItem {
  idGioHang: number;
  idXe: number;
  SoLuong: number;
  xe: {
    TenXe: string;
    GiaXe: number;
    MauSac: string;
    HinhAnh: string;
    TrangThai: string;
  };
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbardashboard: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch session", error);
        setUser(null);
      }
    };

    const fetchNotifications = async () => {
      // Mock data to match your example image
      const mockNotifications: Notification[] = [
        {
          id: 1,
          message: "Đặt cọc mới #1 cần xử lý",
          timestamp: "21/04/2025,9:00:56 PM",
          isRead: false,
        },
        {
          id: 2,
          message: "Đặt cọc mới #2 cần xử lý",
          timestamp: "21/04/2025,9:02:00 PM",
          isRead: false,
        },
      ];
      setNotifications(mockNotifications);
    };

    fetchSession();
    fetchNotifications();

    // Close notification dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.getElementById("notification-dropdown");
        if (dropdown) {
          dropdown.removeAttribute("open");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setCartItems([]); // Clear cart items on logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing the dropdown
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-base-100 border-b z-50 w-full">
      <div className="navbar w-full bg-white">
        <div className="flex-none">
          <button
            className="btn btn-square text-black btn-ghost"
            onClick={onToggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <Link href="/dashboard" className="btn btn-ghost text-black text-xl">
            Dashboard
          </Link>
        </div>

        {/* Notification Icon and Dropdown */}
        <div className="dropdown dropdown-end mr-2" ref={notificationRef}>
          <details id="notification-dropdown" className="dropdown">
            <summary className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item">
                    {unreadCount}
                  </span>
                )}
              </div>
            </summary>
            <div className="dropdown-content z-[100] menu shadow bg-base-100 rounded-box w-80">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">
                    Thông báo{" "}
                    {unreadCount > 0 && (
                      <span className="ml-1">{unreadCount}</span>
                    )}
                  </h3>
                  <button
                    onClick={clearAllNotifications}
                    className="btn btn-sm btn-ghost"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="divider my-0"></div>

                {notifications.length > 0 ? (
                  <ul className="menu p-0">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="border-b last:border-b-0"
                      >
                        <div className="flex justify-between items-center p-2 hover:bg-base-200">
                          <div className="flex-1">
                            <div className="font-medium">
                              {notification.message}
                            </div>
                            <div className="text-sm text-gray-500">
                              {notification.timestamp}
                            </div>
                          </div>
                          <button
                            onClick={(e) =>
                              deleteNotification(notification.id, e)
                            }
                            className="btn btn-ghost btn-sm btn-circle"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    Không có thông báo nào
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>

        {/* User Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar flex items-center justify-center"
          >
            <div
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold leading-none"
              style={{ lineHeight: "2.5rem" }}
            >
              {user ? (
                user.Avatar && user.Avatar.length > 0 ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.Avatar}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {user.Hoten ? user.Hoten.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )
              ) : (
                // Fallback display when user is null
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm">?</span>
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/" className="justify-between">
                Home
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard/Changepasswordpage"
                className="justify-between"
              >
                Change Password
              </a>
            </li>
            <li>
              <a href="/Profile" className="justify-between">
                Profile
              </a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbardashboard;
