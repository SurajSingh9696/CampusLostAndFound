'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiEye,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiDownload,
  FiTag,
  FiAlertCircle,
  FiZoomIn,
  FiShare2,
} from 'react-icons/fi';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import {
  formatDate,
  formatTime,
  getStatusColor,
  getPriorityColor,
  getCategoryIcon,
} from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ItemDetailsSkeleton } from '@/components/SkeletonLoader';
import ImageLightbox from '@/components/ImageLightbox';
import toast from 'react-hot-toast';

export default function ItemDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [unwrappedParams.id]);

  const fetchItem = async () => {
    try {
      const data = await api.getItem(unwrappedParams.id);
      setItem(data.item);
    } catch (error) {
      toast.error('Failed to load item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      router.push('/login');
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const data = await api.addComment(unwrappedParams.id, commentText, token);
      setItem((prev) => ({ ...prev, comments: data.comments }));
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim');
      router.push('/login');
      return;
    }

    if (window.confirm('Are you sure you want to claim this item?')) {
      setClaiming(true);
      try {
        const data = await api.claimItem(unwrappedParams.id, token);
        setItem(data.item);
        toast.success('Item claimed successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to claim item');
      } finally {
        setClaiming(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteItem(unwrappedParams.id, token);
        toast.success('Item deleted');
        router.push('/browse');
      } catch (error) {
        toast.error(error.message || 'Failed to delete item');
      }
    }
  };

  const downloadQRCode = () => {
    if (!item?.qrCode) return;
    
    const link = document.createElement('a');
    link.href = item.qrCode;
    link.download = `qrcode-${item.title.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  if (loading) {
    return <ItemDetailsSkeleton />;
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Item not found</h2>
          <button onClick={() => router.push('/browse')} className="btn-primary mt-4">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && item.postedBy._id === user.id;
  const canClaim = isAuthenticated && !isOwner && item.status === 'Open';

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 mb-6 transition-colors duration-200 group"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <FiArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-medium">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card overflow-hidden group"
            >
              {/* Image with Zoom */}
              <div className="relative">
                {item.imageData ? (
                  <>
                    <motion.img
                      src={item.imageData}
                      alt={item.title}
                      className="w-full h-96 object-cover cursor-zoom-in"
                      onClick={() => {
                        setLightboxIndex(0);
                        setShowLightbox(true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Zoom Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                        <FiZoomIn className="w-8 h-8 text-neutral-900" />
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <span className="text-6xl font-bold text-neutral-400 tracking-widest">
                      {getCategoryIcon(item.category)}
                    </span>
                  </div>
                )}
                
                {/* Quick Actions Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {item.qrCode && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={downloadQRCode}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                    >
                      <FiDownload className="w-5 h-5 text-neutral-700" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                  >
                    <FiShare2 className="w-5 h-5 text-neutral-700" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`badge ${
                        item.type === 'Lost' ? 'bg-red-600 text-white' : 'bg-accent-600 text-white'
                      }`}
                    >
                      {item.type === 'Lost' ? 'LOST' : 'FOUND'}
                    </span>
                    <span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span>
                    <span className={`badge ${getPriorityColor(item.priority)}`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{item.title}</h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-4 h-4" />
                      <span>{item.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
                  <p className="text-neutral-700 whitespace-pre-wrap">{item.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-neutral-600">{getCategoryIcon(item.category)}</span>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Category</p>
                      <p className="font-semibold text-neutral-900">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Location</p>
                      <p className="font-semibold text-neutral-900">{item.building || item.location}</p>
                      {item.floor && <p className="text-sm text-neutral-600">Floor: {item.floor}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Date</p>
                      <p className="font-semibold text-neutral-900">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Time</p>
                      <p className="font-semibold text-neutral-900">{formatTime(item.time)}</p>
                    </div>
                  </div>
                </div>

                {/* Optional Details */}
                {item.identifyingFeatures && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center space-x-2">
                      <FiAlertCircle className="w-5 h-5" />
                      <span>Identifying Features</span>
                    </h3>
                    <p className="text-neutral-700">{item.identifyingFeatures}</p>
                  </div>
                )}

                {item.reward && (
                  <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-4">
                    <h3 className="font-semibold text-accent-900 mb-1">Reward Offered</h3>
                    <p className="text-accent-700">{item.reward}</p>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center space-x-2">
                      <FiTag className="w-5 h-5" />
                      <span>Tags</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-neutral-100 text-neutral-700 border border-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {isOwner && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => router.push(`/items/${item._id}/edit`)}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn-outline flex items-center space-x-2 text-accent-600 border-accent-600 hover:bg-accent-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {canClaim && (
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {claiming ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <FiCheckCircle className="w-5 h-5" />
                        <span>Claim This Item</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                <FiMessageSquare className="w-5 h-5" />
                <span>Comments ({item.comments?.length || 0})</span>
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated ? (
                <motion.form 
                  onSubmit={handleAddComment} 
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    className="textarea-field mb-3"
                  />
                  <motion.button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="btn-primary disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submittingComment ? <LoadingSpinner size="sm" /> : 'Post Comment'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-6 border border-primary-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-neutral-700 text-center">
                    Please{' '}
                    <button
                      onClick={() => router.push('/login')}
                      className="text-primary-600 font-semibold hover:underline"
                    >
                      login
                    </button>{' '}
                    to leave a comment
                  </p>
                </motion.div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {item.comments && item.comments.length > 0 ? (
                  item.comments.map((comment, index) => (
                    <motion.div 
                      key={comment._id} 
                      className="flex space-x-3 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {comment.user?.name?.charAt(0).toUpperCase()}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-neutral-900">{comment.user?.name}</span>
                          <span className="text-xs text-neutral-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">{comment.text}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p 
                    className="text-neutral-500 text-center py-12 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No comments yet. Be the first to comment!
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Posted By */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 space-y-4"
            >
              <h3 className="font-bold text-neutral-900 mb-4">Posted By</h3>
              
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {item.postedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{item.postedBy?.name}</p>
                  {item.postedBy?.department && (
                    <p className="text-sm text-neutral-600">{item.postedBy.department}</p>
                  )}
                  {item.postedBy?.reputation > 0 && (
                    <p className="text-xs text-primary-600">⭐ {item.postedBy.reputation} points</p>
                  )}
                </div>
              </div>

              {item.contactEmail && (
                <div className="flex items-center space-x-2 text-sm">
                  <FiMail className="w-4 h-4 text-neutral-500" />
                  <a
                    href={`mailto:${item.contactEmail}`}
                    className="text-primary-600 hover:underline"
                  >
                    {item.contactEmail}
                  </a>
                </div>
              )}

              {item.contactPhone && (
                <div className="flex items-center space-x-2 text-sm">
                  <FiPhone className="w-4 h-4 text-neutral-500" />
                  <a href={`tel:${item.contactPhone}`} className="text-primary-600 hover:underline">
                    {item.contactPhone}
                  </a>
                </div>
              )}
            </motion.div>

            {/* QR Code */}
            {item.qrCode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="font-bold text-neutral-900 mb-4">QR Code</h3>
                <img src={item.qrCode} alt="QR Code" className="w-full rounded-lg mb-4" />
                <button
                  onClick={downloadQRCode}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Image Lightbox */}
        {showLightbox && item.imageData && (
          <ImageLightbox
            images={[item.imageData]}
            currentIndex={lightboxIndex}
            onClose={() => setShowLightbox(false)}
            onPrevious={null}
            onNext={null}
          />
        )}
      </div>
    </div>
  );
}
