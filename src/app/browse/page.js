'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiSliders } from 'react-icons/fi';
import api from '@/lib/api';
import { CATEGORIES, STATUSES, ITEM_TYPES, SORT_OPTIONS, BUILDINGS } from '@/lib/constants';
import { debounce } from '@/lib/utils';
import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ItemCardSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    location: '',
    sort: '-createdAt',
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        q: searchQuery,
        page,
        limit: pagination.limit,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === '') delete params[key];
      });

      const data = await api.getItems(params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, pagination.limit]);

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      status: '',
      location: '',
      sort: '-createdAt',
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '-createdAt').length;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Browse Items</h1>
          <p className="text-neutral-600">Search through lost and found items on campus</p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Box */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
              <FiSearch className="w-5 h-5 text-neutral-400 group-focus-within:text-primary-500" />
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              onChange={handleSearchChange}
              className="w-full input-field pl-12 pr-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  document.querySelector('input[type="text"]').value = '';
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-accent-600 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center justify-center space-x-2 relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSliders className="w-5 h-5" />
              <span>Filters</span>
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                  >
                    {activeFilterCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="select-field flex-1"
              whileHover={{ scale: 1.01 }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>

            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearFilters}
                  className="btn-outline flex items-center justify-center space-x-2 text-accent-600 border-accent-600 hover:bg-accent-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiX className="w-5 h-5" />
                  <span>Clear</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-6 space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Type Filter */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="select-field"
                    >
                      <option value="">All Types</option>
                      {ITEM_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Category Filter */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="select-field"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Status Filter */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="select-field"
                    >
                      <option value="">All Status</option>
                      {STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Location Filter */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="select-field"
                    >
                      <option value="">All Locations</option>
                      {BUILDINGS.map((building) => (
                        <option key={building} value={building}>
                          {building}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ItemCardSkeleton count={pagination.limit} />
          </div>
        ) : items.length > 0 ? (
          <>
            <motion.div 
              className="mb-6 flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-neutral-600">
                Showing <span className="font-bold text-primary-600">{items.length}</span> of{' '}
                <span className="font-bold text-primary-600">{pagination.total}</span> items
              </div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {items.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div 
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={() => fetchItems(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={pagination.page !== 1 ? { scale: 1.05 } : {}}
                  whileTap={pagination.page !== 1 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>
                
                <div className="flex items-center space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                    ) {
                      return (
                        <motion.button
                          key={page}
                          onClick={() => fetchItems(page)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                            page === pagination.page
                              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {page}
                        </motion.button>
                      );
                    } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                      return <span key={page} className="text-neutral-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <motion.button
                  onClick={() => fetchItems(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={pagination.page !== pagination.pages ? { scale: 1.05 } : {}}
                  whileTap={pagination.page !== pagination.pages ? { scale: 0.95 } : {}}
                >
                  Next
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            icon="🔍"
            title="No items found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
