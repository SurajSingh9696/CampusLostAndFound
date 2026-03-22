'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiEye, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { formatDate, getStatusColor, getCategoryIcon, truncateText } from '@/lib/utils';
import { useState } from 'react';

export default function ItemCard({ item, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const claimsCount = item.claims?.length || 0;
  const foundsCount = item.foundReports?.length || 0;
  const hasActivity = (item.type === 'Found' && claimsCount > 0) || (item.type === 'Lost' && foundsCount > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/items/${item._id}`}>
        <motion.div 
          className="card-interactive h-full group relative"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 overflow-hidden">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {item.imageData ? (
                <img
                  src={item.imageData}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                  <span className="text-2xl font-bold text-neutral-500 tracking-wider">{getCategoryIcon(item.category)}</span>
                </div>
              )}
            </motion.div>
            
            {/* Gradient Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            />
            
            {/* Type Badge */}
            <motion.div 
              className={`absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-semibold ${
                item.type === 'Lost' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-accent-600 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {item.type === 'Lost' ? 'LOST' : 'FOUND'}
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className={`absolute top-3 right-3 badge ${getStatusColor(item.status)}`}
              whileHover={{ scale: 1.05 }}
            >
              {item.status}
            </motion.div>

            {/* Claims/Found Count Badge */}
            {hasActivity && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center space-x-1 ${
                  item.type === 'Found'
                    ? 'bg-accent-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <span>{item.type === 'Found' ? claimsCount : foundsCount}</span>
                <span>{item.type === 'Found' ? (claimsCount === 1 ? 'Claim' : 'Claims') : (foundsCount === 1 ? 'Found' : 'Founds')}</span>
              </motion.div>
            )}

            {/* Quick Action Buttons (appear on hover) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-3 right-3 flex space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-accent-500 hover:text-white transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to favorites functionality
                }}
              >
                <FiHeart className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Title with gradient on hover */}
            <motion.h3 
              className="text-lg font-bold text-neutral-900 line-clamp-1 group-hover:gradient-text transition-all duration-300"
              animate={{ x: isHovered ? 4 : 0 }}
            >
              {item.title}
            </motion.h3>

            {/* Description */}
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {truncateText(item.description, 80)}
            </p>

            {/* Category with icon */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                {getCategoryIcon(item.category)}
              </span>
              <span className="text-sm font-medium text-neutral-700">{item.category}</span>
            </div>

            {/* Location & Time */}
            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              <div className="flex items-center space-x-1">
                <FiMapPin className="w-3 h-3" />
                <span className="line-clamp-1">{item.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiClock className="w-3 h-3" />
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              {/* Posted By */}
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-7 h-7 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {item.postedBy?.name?.charAt(0).toUpperCase()}
                </motion.div>
                <span className="text-xs text-neutral-600 line-clamp-1 font-medium">
                  {item.postedBy?.name}
                </span>
              </div>

              {/* Stats with hover effects */}
              <div className="flex items-center space-x-3 text-neutral-500">
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1, color: '#f8a912' }}
                >
                  <FiEye className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{item.views || 0}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1, color: '#4caf50' }}
                >
                  <FiMessageSquare className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{item.comments?.length || 0}</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Animated Border on Hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary-400 pointer-events-none"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 1.05
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
