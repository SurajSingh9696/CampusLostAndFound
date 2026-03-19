'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiHome, FiGrid, FiPlusCircle, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/browse', label: 'Browse Items', icon: FiGrid },
    { href: '/post-item', label: 'Post Item', icon: FiPlusCircle, protected: true },
    { href: '/admin', label: 'Admin', icon: FiShield, protected: true, adminOnly: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-sm shadow-md border-b border-neutral-200'
          : 'bg-white border-b border-neutral-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src="/logo.png" alt="Campus Lost & Found" width={36} height={36} className="rounded-lg" />
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold text-secondary-900">
                Campus Lost & Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;
              if (link.adminOnly && user?.role !== 'admin') return null;
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-secondary-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-neutral-700 text-sm font-medium hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-5 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => {
                if (link.protected && !isAuthenticated) return null;
                if (link.adminOnly && user?.role !== 'admin') return null;
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-600 hover:bg-accent-50 transition-colors duration-200"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-lg text-neutral-700 font-medium hover:bg-neutral-100 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center btn-primary"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
