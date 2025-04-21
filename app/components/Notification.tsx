"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate fetching notifications
  useEffect(() => {
    // This would be replaced with your actual API call
    const mockNotifications = [
      {
        id: 1,
        message: "Đặt cọc đơn hàng #1, số tiền đặt cọc:10.000.000đ thành công",
        timestamp: "21/04/2025,9:00:56 PM",
        read: false,
      },
      {
        id: 2,
        message: "Đặt cọc đơn hàng #2, số tiền đặt cọc:20.000.000đ thành công",
        timestamp: "21/04/2025,9:02:00 PM",
        read: false,
      },
    ];

    setNotifications(mockNotifications);
    updateUnreadCount(mockNotifications);
  }, []);

  // Update unread count when notifications change
  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter((n) => !n.read).length);
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  // Delete notification
  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropdown from closing
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  // Delete all notifications
  const deleteAllNotifications = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropdown from closing
    setNotifications([]);
    setUnreadCount(0);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle clicking a notification
  const handleNotificationClick = (id: number) => {
    markAsRead(id);
    // Add any navigation or additional action here
  };

  return (
    <div className="dropdown dropdown-end mr-2">
      <button
        onClick={toggleDropdown}
        className="btn btn-ghost btn-circle relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="badge badge-sm badge-primary absolute -top-1 -right-1">
            {unreadCount}
          </span>
        )}
      </button>

      <div
        className={`dropdown-content absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 ${isOpen ? "block" : "hidden"}`}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-medium">
            Thông báo{" "}
            <span className="badge badge-sm badge-primary ml-2">
              {notifications.length}
            </span>
          </h3>
          <button
            onClick={deleteAllNotifications}
            className="text-xs text-blue-600 hover:underline"
          >
            Xóa tất cả
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto p-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteNotification(notification.id, e)}
                    className="text-gray-400 hover:text-red-500 ml-2"
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
        )}
      </div>
    </div>
  );
}
