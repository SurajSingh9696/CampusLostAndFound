'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function NotificationBadge() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalCount = notifications.length;

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const data = await api.getNotifications(token);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if not already
      if (!notification.read) {
        await api.markNotificationAsRead(notification._id, token);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      }

      // Navigate to item
      setShowNotifications(false);
      router.push(`/items/${notification.item._id}`);
    } catch (error) {
      toast.error('Error marking notification as read');
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.notification-dropdown')) return;
    setShowNotifications(false);
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative notification-dropdown">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifications(!showNotifications);
        }}
        className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell className="w-5 h-5 text-neutral-700" />
        {totalCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ${
              unreadCount > 0 ? 'bg-accent-500' : 'bg-neutral-500'
            }`}
          >
            {totalCount > 9 ? '9+' : totalCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50">
              <h3 className="font-bold text-neutral-900">Notifications</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(false);
                }}
                className="p-1 hover:bg-white/50 rounded transition-colors duration-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-neutral-100 cursor-pointer transition-colors duration-200 hover:bg-neutral-50 ${
                      !notification.read ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                        notification.type === 'claim' ? 'bg-accent-500' : 'bg-green-500'
                      }`}>
                        {notification.sender?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-900 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No notifications yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
