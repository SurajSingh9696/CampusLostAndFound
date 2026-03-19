'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { useState } from 'react';

export default function ImageLightbox({ images, currentIndex, onClose, onPrevious, onNext }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrevious) onPrevious();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrevious, onNext]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 hover:bg-white/20 text-white rounded-full transition-colors duration-200"
            disabled={zoom <= 1}
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm px-2">{Math.round(zoom * 100)}%</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 hover:bg-white/20 text-white rounded-full transition-colors duration-200"
            disabled={zoom >= 3}
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 hover:bg-white/20 text-white rounded-full transition-colors duration-200"
          >
            <FiDownload className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Button */}
        {images.length > 1 && onPrevious && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
              resetZoom();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
              resetZoom();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain cursor-move select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transition: 'transform 0.2s ease-out',
            }}
            draggable={false}
            onDoubleClick={() => zoom === 1 ? handleZoomIn() : resetZoom()}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Thumbnail Strip (if multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle thumbnail click - would need to be passed as prop
                }}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-medium">
                +{images.length - 5}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
