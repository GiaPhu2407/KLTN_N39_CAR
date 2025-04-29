"use client";

import { Bell, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export function NotificationBell({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Function to fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(
        (data.notifications || []).filter((n: Notification) => !n.read).length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    // Subscribe to user's notification channel
    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Fetch existing notifications
    fetchNotifications();

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId, forceRefresh]);

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        // Refresh notifications from server after successful update
        fetchNotifications();
      } else {
        console.error(
          "Error marking notification as read:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (
    e: React.MouseEvent,
    notificationId: number
  ) => {
    // Prevent the click event from propagating to the parent div
    e.stopPropagation();

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Force a complete refresh of notifications from the server
        setForceRefresh((prev) => prev + 1);
      } else {
        console.error("Failed to delete notification:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/all`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Force a complete refresh of notifications from the server
        setForceRefresh((prev) => prev + 1);
      } else {
        console.error(
          "Failed to delete all notifications:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="badge badge-sm indicator-item badge-primary">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 mt-4"
      >
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <div className="font-bold">Thông báo</div>
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="btn btn-sm btn-error btn-outline"
              title="Xóa tất cả thông báo"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa tất cả
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center p-4 text-base-content/60">
            Không có thông báo
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 cursor-pointer hover:bg-base-200 ${
                  !notification.read ? "bg-base-200" : ""
                } relative`}
              >
                <div className="font-medium pr-6">{notification.message}</div>
                <div className="text-xs text-base-content/60">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
                <button
                  onClick={(e) => deleteNotification(e, notification.id)}
                  className="absolute top-2 right-2 p-1 text-error hover:bg-base-300 rounded-full"
                  title="Xóa thông báo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
