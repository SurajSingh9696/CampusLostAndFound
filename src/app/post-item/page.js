'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiMapPin, FiCalendar, FiClock, FiTag, FiAlertCircle, FiMail, FiPhone, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { CATEGORIES, ITEM_TYPES, PRIORITIES, BUILDINGS } from '@/lib/constants';
import { compressImage } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PostItemPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lost',
    category: '',
    location: '',
    building: '',
    floor: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    imageData: '',
    priority: 'Medium',
    tags: '',
    reward: '',
    identifyingFeatures: '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to post an item');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Image size must be less than 1MB. Compressing...');
    }

    try {
      const compressed = await compressImage(file, 1);
      setImagePreview(compressed);
      setFormData((prev) => ({ ...prev, imageData: compressed }));
      toast.success('Image processed successfully');
    } catch (error) {
      toast.error('Error processing image');
      console.error(error);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageData: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process tags
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const itemData = {
        ...formData,
        tags,
      };

      const data = await api.createItem(itemData, token);
      toast.success('Item posted successfully!');
      router.push(`/items/${data.item._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FiUpload className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Post an Item</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">
              Help reunite lost items with their owners or report something you've found
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >

          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-8 shadow-xl border border-neutral-200/50">
            {/* Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">1</span>
                </div>
                <label className="block text-base font-semibold text-neutral-900">
                  Select Item Type *
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {ITEM_TYPES.map((type, index) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      formData.type === type.value
                        ? 'border-primary-600 bg-gradient-to-br from-white to-primary-50 shadow-lg ring-2 ring-primary-200'
                        : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-neutral-50/50 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {formData.type === type.value && (
                      <motion.div
                        layoutId="typeHighlight"
                        className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-transparent"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className={`text-2xl font-bold mb-3 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        formData.type === type.value
                          ? type.value === 'Lost' ? 'bg-red-500 text-white shadow-lg' : 'bg-accent-500 text-white shadow-lg'
                          : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                      }`}>
                        {type.icon}
                      </div>
                      <div className={`font-display font-bold text-xl mb-1 ${
                        formData.type === type.value ? 'text-primary-700' : 'text-neutral-900'
                      }`}>{type.label}</div>
                      <div className={`text-sm ${
                        formData.type === type.value ? 'text-primary-600/90' : 'text-neutral-600'
                      }`}>
                        {type.value === 'Lost' ? 'Report a missing item' : 'Report a found item'}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Basic Information Section */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">2</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900">Basic Information</h3>
              </div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Black iPhone 13 Pro"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1.5">Be specific to help identify the item</p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="textarea-field"
                  placeholder="Provide detailed description to help identify the item..."
                  required
                />
                <p className="text-xs text-neutral-500 mt-1.5">Include color, size, brand, or any unique features</p>
              </motion.div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Priority Level *
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                    required
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">3</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900 flex items-center space-x-2">
                  <FiMapPin className="w-5 h-5 text-primary-600" />
                  <span>Location Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="building" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Building *
                  </label>
                  <select
                    id="building"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                    required
                  >
                    <option value="">Select building</option>
                    {BUILDINGS.map((building) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="floor" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Floor
                  </label>
                  <input
                    type="text"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 2nd"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Specific Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Near the water fountain, Room 204"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1.5">Help others find or identify the location</p>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">4</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900">Date & Time</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Date {formData.type === 'Lost' ? 'Lost' : 'Found'} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiCalendar className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Approximate Time *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiClock className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-bold">5</span>
                  </div>
                  <label className="text-base font-semibold text-neutral-900 flex items-center space-x-2">
                    <FiUpload className="w-5 h-5 text-primary-600" />
                    <span>Upload Image</span>
                  </label>
                </div>
                <span className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">Optional</span>
              </div>
              
              {imagePreview ? (
                <motion.div 
                  className="relative w-full h-72 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl overflow-hidden shadow-lg group border-2 border-neutral-200"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-6"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      className="p-4 bg-white rounded-full shadow-2xl hover:bg-neutral-50 transition-colors duration-200"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX className="w-6 h-6 text-red-600" />
                    </motion.button>
                  </motion.div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg flex items-center space-x-1.5">
                      <span>✓</span>
                      <span>Uploaded</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-neutral-300 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-transparent transition-all duration-300 group">
                  <div className="flex flex-col items-center justify-center space-y-4 p-6">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                    >
                      <FiUpload className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="text-center max-w-xs">
                      <p className="text-base font-semibold text-neutral-700 group-hover:text-primary-600 transition-colors duration-300 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-neutral-500">PNG, JPG, GIF up to 1MB</p>
                      <p className="text-xs text-neutral-400 mt-3 px-4">
                        📸 A clear photo helps identify items faster
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">6</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900 flex items-center space-x-2">
                  <FiAlertCircle className="w-5 h-5 text-primary-600" />
                  <span>Additional Details</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="identifyingFeatures" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Identifying Features
                  </label>
                  <textarea
                    id="identifyingFeatures"
                    name="identifyingFeatures"
                    value={formData.identifyingFeatures}
                    onChange={handleChange}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="Special markings, scratches, stickers, unique characteristics..."
                  />
                  <p className="text-xs text-neutral-500 mt-1.5">Help verify ownership with specific details</p>
                </div>

                <div>
                  <label htmlFor="reward" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Reward (if any)
                  </label>
                  <input
                    type="text"
                    id="reward"
                    name="reward"
                    value={formData.reward}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., $20 reward, Coffee gift card"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiTag className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="Comma separated: apple, black, case, 2024"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1.5">Add keywords to improve search results</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold">7</span>
                </div>
                <h3 className="text-base font-semibold text-neutral-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-500">We'll use this information to contact you about the item</p>
            </div>

            {/* Submit Button */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-8 border-t-2 border-neutral-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary h-14 flex items-center justify-center text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Posting...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-6 h-6 mr-2" />
                    Post Item
                  </>
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => router.back()}
                className="btn-outline h-14 px-8 flex items-center justify-center"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
