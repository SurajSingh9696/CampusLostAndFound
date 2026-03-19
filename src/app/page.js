'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiTrendingUp, FiEye, FiCheckCircle, FiClock, FiArrowRight, FiZap, FiShield, FiUsers, FiSearch, FiMessageCircle, FiCheck } from 'react-icons/fi';
import api from '@/lib/api';
import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnimatedCounter from '@/components/AnimatedCounter';
import { ItemCardSkeleton, StatCardSkeleton } from '@/components/SkeletonLoader';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, itemsData] = await Promise.all([
        api.getStats(),
        api.getItems({ limit: 6, status: 'Open' }),
      ]);

      setStats(statsData.stats);
      setRecentItems(itemsData.items);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FiClock,
      label: 'Active Items',
      value: (stats?.lostItems || 0) + (stats?.foundItems || 0),
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: FiCheckCircle,
      label: 'Items Returned',
      value: stats?.returnedItems || 0,
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: FiTrendingUp,
      label: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: FiEye,
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      color: 'from-neutral-600 to-neutral-700',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-neutral-50 to-white overflow-hidden">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}/>
        </div>

        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]"/>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block"
            >
              <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-md border border-primary-200">
                <FiZap className="w-3.5 h-3.5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Enterprise Campus Management</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Professional Lost & Found
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Management System
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Streamline item recovery with advanced search capabilities, secure authentication, 
              and real-time notifications. Built for modern campus environments.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/browse" className="btn-primary text-base group inline-flex items-center">
                  Browse Items
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/post-item" className="btn-outline text-base">
                  Report an Item
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCardSkeleton count={4} />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const numValue = typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value;
                
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      transition: { duration: 0.2 }
                    }}
                    className="card p-6 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Animated Background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-2 h-2 bg-gradient-to-r ${stat.color} rounded-full`}
                        />
                      </div>
                      <div className="text-4xl font-bold text-neutral-900 mb-2">
                        {typeof stat.value === 'string' && stat.value.includes('%') ? (
                          <AnimatedCounter value={numValue} suffix="%" />
                        ) : (
                          <AnimatedCounter value={numValue || 0} />
                        )}
                      </div>
                      <div className="text-sm font-medium text-neutral-600">{stat.label}</div>
                    </div>

                    {/* Hover Indicator */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-2">
                Recent Items
              </h2>
              <p className="text-neutral-600">Latest reported lost and found items</p>
            </div>
            <Link
              href="/browse"
              className="hidden sm:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 group"
            >
              <span>View All</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ItemCardSkeleton count={6} />
            </div>
          ) : recentItems.length > 0 ? (
            <>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {recentItems.map((item, index) => (
                  <ItemCard key={item._id} item={item} index={index} />
                ))}
              </motion.div>
              <div className="sm:hidden mt-8 text-center">
                <Link href="/browse" className="btn-primary inline-flex items-center space-x-2">
                  <span>View All Items</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">No items posted yet</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Three simple steps to recover your items or help others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Report or Search',
                description: 'Submit detailed reports of lost or found items with images and location data. Use advanced search filters to find matches.',
                icon: FiSearch,
                color: 'from-primary-500 to-primary-600',
              },
              {
                step: '02',
                title: 'Verify & Connect',
                description: 'Receive instant notifications on potential matches. Communicate securely through our messaging system to verify ownership.',
                icon: FiMessageCircle,
                color: 'from-accent-500 to-accent-600',
              },
              {
                step: '03',
                title: 'Complete Transaction',
                description: 'Arrange safe pickup locations on campus. Update item status and provide feedback to build community trust.',
                icon: FiCheck,
                color: 'from-secondary-600 to-secondary-700',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-lg border border-neutral-200 h-full hover:border-primary-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center shadow-md`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-neutral-400 mb-2">STEP {step.step}</div>
                      <h3 className="text-xl font-display font-bold text-secondary-900 mb-3">{step.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-10 transform -translate-y-1/2 z-10">
                    <FiArrowRight className="w-6 h-6 text-neutral-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm0 17.27l11.314 11.315-1.414 1.414L30 17.886V60h-2V17.886L15.858 30.03l-1.414-1.414L26.586 16.47 28 15.06l1.414 1.414L41.556 28.616z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}/>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md border border-white/20">
              <FiShield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Secure & Trusted Platform</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of users who have successfully recovered their items through our platform. Your lost belongings are just a post away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/post-item"
                  className="bg-white text-secondary-900 hover:bg-neutral-100 font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg inline-flex items-center space-x-2"
                >
                  <span>Report an Item</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Create Account
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
