'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiDatabase,
  FiFileText,
  FiLock,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUnlock,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const tabs = [
  { key: 'overview', label: 'Overview', icon: FiDatabase },
  { key: 'users', label: 'Users', icon: FiUsers },
  { key: 'items', label: 'Items', icon: FiFileText },
  { key: 'logs', label: 'Activity Logs', icon: FiActivity },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [overview, setOverview] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [logsData, setLogsData] = useState([]);

  const [userSearch, setUserSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  const canAccess = isAuthenticated && user?.role === 'admin';

  const summaryCards = useMemo(() => {
    if (!overview?.summary) return [];

    const stats = overview.summary;
    return [
      {
        label: 'Total Users',
        value: stats.totalUsers,
        icon: FiUsers,
        color: 'from-secondary-700 to-secondary-900',
      },
      {
        label: 'Blocked Users',
        value: stats.blockedUsers,
        icon: FiLock,
        color: 'from-red-600 to-red-700',
      },
      {
        label: 'Total Items',
        value: stats.totalItems,
        icon: FiFileText,
        color: 'from-primary-600 to-primary-700',
      },
      {
        label: 'Open Items',
        value: stats.openItems,
        icon: FiAlertCircle,
        color: 'from-amber-500 to-amber-600',
      },
      {
        label: 'Returned',
        value: stats.returnedItems,
        icon: FiCheckCircle,
        color: 'from-emerald-600 to-emerald-700',
      },
      {
        label: 'Admin Accounts',
        value: stats.adminUsers,
        icon: FiShield,
        color: 'from-indigo-600 to-indigo-700',
      },
    ];
  }, [overview]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Admin access required');
      router.push('/');
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, user?.role, router]);

  const fetchAdminData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [overviewRes, usersRes, itemsRes, logsRes] = await Promise.all([
        api.getAdminOverview(token),
        api.getAdminUsers({ limit: 20 }, token),
        api.getAdminItems({ limit: 20 }, token),
        api.getAdminLogs({ limit: 25 }, token),
      ]);

      setOverview(overviewRes);
      setUsersData(usersRes.users || []);
      setItemsData(itemsRes.items || []);
      setLogsData(logsRes.logs || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAdminData();
  };

  const handleUserAction = async (targetUserId, action) => {
    const reason = window.prompt('Optional reason for this action:') || '';

    try {
      await api.updateAdminUser(targetUserId, { action, reason }, token);
      toast.success('User updated successfully');
      await fetchAdminData();
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (targetUserId, userEmail) => {
    const confirmed = window.confirm(`Delete user ${userEmail}? This will also remove all items posted by this user.`);
    if (!confirmed) return;

    const reason = window.prompt('Deletion reason (optional):') || '';

    try {
      await api.deleteAdminUser(targetUserId, { reason }, token);
      toast.success('User deleted successfully');
      await fetchAdminData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleDeleteItem = async (itemId, title) => {
    const confirmed = window.confirm(`Delete item "${title}"?`);
    if (!confirmed) return;

    const reason = window.prompt('Deletion reason (optional):') || '';

    try {
      await api.deleteAdminItem(itemId, { reason }, token);
      toast.success('Item deleted successfully');
      await fetchAdminData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersData;
    const query = userSearch.toLowerCase();

    return usersData.filter((entry) =>
      [entry.name, entry.email, entry.department, entry.studentId]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [usersData, userSearch]);

  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return itemsData;
    const query = itemSearch.toLowerCase();

    return itemsData.filter((entry) =>
      [entry.title, entry.description, entry.location, entry.category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [itemsData, itemSearch]);

  if (!canAccess) {
    return <LoadingSpinner fullScreen />;
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-secondary-100/40">
      <div className="bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, #ffffff 0, transparent 20%), radial-gradient(circle at 80% 0%, #ffffff 0, transparent 25%)',
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Admin Control Center</h1>
              <p className="text-secondary-100 mt-2 max-w-2xl">
                Manage users, moderate posted items, and monitor every critical administrative action.
              </p>
            </div>
            <button
              onClick={refreshData}
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-2 font-semibold"
              disabled={refreshing}
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-6">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-2 flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-secondary-800 text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {summaryCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">{card.label}</p>
                        <p className="text-2xl font-bold text-neutral-900 mt-1">{card.value}</p>
                      </div>
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <section className="card p-6">
                <h2 className="text-lg font-display font-bold text-neutral-900 mb-4">Recent Items</h2>
                <div className="space-y-3">
                  {(overview?.recentItems || []).map((item) => (
                    <div key={item._id} className="border border-neutral-200 rounded-lg p-3">
                      <p className="font-semibold text-neutral-900">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.type} | {item.status} | by {item.postedBy?.name || 'Unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="text-lg font-display font-bold text-neutral-900 mb-4">Recent Admin Activity</h2>
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {(overview?.recentLogs || []).map((log) => (
                    <div key={log._id} className="border border-neutral-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-neutral-900">{log.action}</p>
                      <p className="text-xs text-neutral-600 mt-1">{log.details || 'No details'}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {log.actor?.name || 'System'} | {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <section className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <h2 className="text-xl font-display font-bold text-neutral-900">User Administration</h2>
              <div className="relative w-full md:w-80">
                <FiSearch className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="input-field pl-9"
                  placeholder="Search by name, email, department"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-200">
                    <th className="py-3 pr-3">User</th>
                    <th className="py-3 pr-3">Role</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">Department</th>
                    <th className="py-3 pr-3">Joined</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((entry) => (
                    <tr key={entry._id} className="border-b border-neutral-100">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-neutral-900">{entry.name}</p>
                        <p className="text-xs text-neutral-500">{entry.email}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`badge ${entry.role === 'admin' ? 'badge-secondary' : 'badge-primary'}`}>
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`badge ${entry.isBlocked ? 'badge-error' : 'badge-success'}`}>
                          {entry.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-sm text-neutral-600">{entry.department || '-'}</td>
                      <td className="py-3 pr-3 text-sm text-neutral-600">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {entry.isBlocked ? (
                            <button
                              onClick={() => handleUserAction(entry._id, 'unblock')}
                              className="px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <FiUnlock className="w-3.5 h-3.5" /> Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(entry._id, 'block')}
                              className="px-2.5 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <FiLock className="w-3.5 h-3.5" /> Block
                            </button>
                          )}

                          {entry.role === 'admin' ? (
                            <button
                              onClick={() => handleUserAction(entry._id, 'make-student')}
                              className="px-2.5 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <FiUser className="w-3.5 h-3.5" /> Make Student
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(entry._id, 'make-admin')}
                              className="px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <FiShield className="w-3.5 h-3.5" /> Make Admin
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteUser(entry._id, entry.email)}
                            className="px-2.5 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'items' && (
          <section className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <h2 className="text-xl font-display font-bold text-neutral-900">Item Moderation</h2>
              <div className="relative w-full md:w-80">
                <FiSearch className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="input-field pl-9"
                  placeholder="Search title, category, location"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredItems.map((entry) => (
                <div key={entry._id} className="border border-neutral-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-900">{entry.title}</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {entry.type} | {entry.category} | {entry.status}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Posted by {entry.postedBy?.name || 'Unknown'} ({entry.postedBy?.email || 'N/A'})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/items/${entry._id}`)}
                      className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteItem(entry._id, entry.title)}
                      className="px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'logs' && (
          <section className="card p-6">
            <h2 className="text-xl font-display font-bold text-neutral-900 mb-5">Administrative Activity Tracking</h2>
            <div className="space-y-3">
              {logsData.map((entry) => (
                <div key={entry._id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-neutral-900">{entry.action}</p>
                      <p className="text-sm text-neutral-600 mt-1">{entry.details || 'No details provided'}</p>
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
                      {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    By: {entry.actor?.name || 'System'} ({entry.actor?.email || 'n/a'})
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
