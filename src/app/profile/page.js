'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookmark,
  FiHash,
  FiAward,
  FiBox,
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
} from 'react-icons/fi';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, token } = useAuthStore();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posted');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    studentId: '',
    bio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view profile');
      router.push('/login');
      return;
    }

    setEditedProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      studentId: user?.studentId || '',
      bio: user?.bio || '',
    });

    fetchMyItems();
  }, [isAuthenticated, router, user]);

  const fetchMyItems = async () => {
    try {
      const data = await api.getItems({ limit: 100 });
      const userItems = data.items.filter((item) => item.postedBy._id === user.id);
      setMyItems(userItems);
    } catch (error) {
      toast.error('Failed to load items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || '',
        studentId: user?.studentId || '',
        bio: user?.bio || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateProfile(editedProfile, token);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const joinedDate = (() => {
    if (!user?.createdAt) return 'N/A';
    const parsedDate = new Date(user.createdAt);
    if (Number.isNaN(parsedDate.getTime())) return 'N/A';
    return parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  })();

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  const postedItems = myItems.filter((item) => item.postedBy._id === user.id);
  const claimedItems = myItems.filter(
    (item) => item.claimedBy && item.claimedBy._id === user.id
  );

  const stats = [
    {
      icon: FiBox,
      label: 'Items Posted',
      value: user?.itemsPosted || postedItems.length,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      icon: FiCheckCircle,
      label: 'Items Returned',
      value: user?.itemsReturned || 0,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-600',
    },
    {
      icon: FiAward,
      label: 'Reputation Score',
      value: user?.reputation || 0,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-600',
    },
    {
      icon: FiTrendingUp,
      label: 'Total Views',
      value: myItems.reduce((sum, item) => sum + (item.views || 0), 0),
      color: 'from-neutral-600 to-neutral-700',
      bgColor: 'bg-neutral-50',
      textColor: 'text-neutral-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-28 h-28 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl border-4 border-white/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary-600 transition-colors">
                  <FiCamera className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{user?.name}</h1>
                <p className="text-white/90 flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <FiMail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  {user?.role === 'admin' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-500 text-white shadow-lg">
                      <FiAward className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    Joined {joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleEditToggle}
                className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit3 className="w-5 h-5" />}
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card p-6 hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-neutral-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Profile Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-8 mb-8 shadow-xl border border-neutral-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
              <FiUser className="w-6 h-6 text-primary-600" />
              <span>Profile Information</span>
            </h2>
            <AnimatePresence mode="wait">
              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMail className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="john@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiPhone className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editedProfile.phone}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiBookmark className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={editedProfile.department}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="studentId" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Student ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiHash className="w-5 h-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={editedProfile.studentId}
                        onChange={handleInputChange}
                        className="input-field pl-12"
                        placeholder="STU12345"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="textarea-field"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-neutral-500 mt-1.5">Max 500 characters</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-base font-semibold text-neutral-900 truncate">{user?.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FiMail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-base font-semibold text-neutral-900 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FiPhone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-base font-semibold text-neutral-900 truncate">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FiBookmark className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Department</p>
                      <p className="text-base font-semibold text-neutral-900 truncate">{user?.department || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FiHash className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Student ID</p>
                      <p className="text-base font-semibold text-neutral-900 truncate">{user?.studentId || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {user?.bio && (
                  <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-primary-50/30 border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Bio</p>
                    <p className="text-base text-neutral-700 leading-relaxed">{user.bio}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-6 bg-white rounded-xl p-1.5 shadow-md border border-neutral-200">
          <button
            onClick={() => setActiveTab('posted')}
            className={`flex-1 pb-3 pt-3 px-4 font-semibold transition-all duration-200 rounded-lg ${
              activeTab === 'posted'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Posted Items ({postedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`flex-1 pb-3 pt-3 px-4 font-semibold transition-all duration-200 rounded-lg ${
              activeTab === 'claimed'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Claimed Items ({claimedItems.length})
          </button>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {activeTab === 'posted' && (
              <>
                {postedItems.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {postedItems.map((item, index) => (
                      <ItemCard key={item._id} item={item} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon="📦"
                    title="No items posted yet"
                    description="Start by posting a lost or found item to help the community."
                    action={
                      <button
                        onClick={() => router.push('/post-item')}
                        className="btn-primary"
                      >
                        Post Your First Item
                      </button>
                    }
                  />
                )}
              </>
            )}

            {activeTab === 'claimed' && (
              <>
                {claimedItems.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {claimedItems.map((item, index) => (
                      <ItemCard key={item._id} item={item} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon="✨"
                    title="No claimed items"
                    description="When you claim items, they will appear here."
                    action={
                      <button
                        onClick={() => router.push('/browse')}
                        className="btn-primary"
                      >
                        Browse Items
                      </button>
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
