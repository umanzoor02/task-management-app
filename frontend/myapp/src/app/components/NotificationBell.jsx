'use client';

import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';

import {
  getNotifications,
  markNotificationAsRead,
} from '../lib/api';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  async function handleNotificationClick(notification) {
    if (notification.is_read) {
      return;
    }

    try {
      const updatedNotification =
        await markNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === updatedNotification.id
            ? updatedNotification
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-11 items-center justify-center rounded-xl border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="size-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[420px] overflow-y-auto"
      >
        <div className="border-b px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              Notifications
            </p>

            {unreadCount > 0 && (
              <Badge variant="secondary">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {loading && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No notifications yet.
          </div>
        )}

        {!loading &&
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() =>
                handleNotificationClick(notification)
              }
              className="cursor-pointer items-start gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${
                    notification.is_read
                      ? 'text-muted-foreground'
                      : 'font-medium text-foreground'
                  }`}
                >
                  {notification.message}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </p>
              </div>

              {notification.is_read && (
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}