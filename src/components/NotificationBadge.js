'use client';

import { motion } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function NotificationBadge({ count = 0 }) {
  const [showNotifications, setShowNotifications] = useState(false);

  if (count === 0) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell className="w-5 h-5 text-neutral-700" />
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      </motion.button>

      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-50"
        >
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-bold text-neutral-900">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 hover:bg-neutral-100 rounded transition-colors duration-200"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 text-center text-neutral-500 text-sm">
              No notifications yet
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
