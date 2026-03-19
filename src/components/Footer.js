'use client';

import Link from 'next/link';
import { FiHeart, FiGithub, FiMail, FiMapPin, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white border-t border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiPackage className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-display font-bold">Campus Lost & Found</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Professional lost and found management system for modern campus environments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/post-item" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Post Item
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>ID Cards & Documents</li>
              <li>Electronics & Gadgets</li>
              <li>Books & Stationery</li>
              <li>Clothing & Accessories</li>
              <li>Keys & Wallets</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-neutral-400 text-sm">
                <FiMapPin className="w-4 h-4" />
                <span>Campus Central Office</span>
              </li>
              <li className="flex items-center space-x-2 text-neutral-400 text-sm">
                <FiMail className="w-4 h-4" />
                <a href="mailto:lostandfound@campus.edu" className="hover:text-white transition-colors duration-200">
                  lostandfound@campus.edu
                </a>
              </li>
              <li className="flex items-center space-x-2 text-neutral-400 text-sm">
                <FiGithub className="w-4 h-4" />
                <a
                  href="https://github.com/SurajSingh9696"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  GitHub Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-neutral-400 text-sm">
            © {currentYear} Campus Lost & Found. All rights reserved.
          </p>
          <p className="text-neutral-400 text-sm flex items-center space-x-1">
            <span>Made with</span>
            <motion.span
              className="inline-block"
              animate={{
                scale: [1, 1.3, 1],
                rotateY: [0, 360, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: "preserve-3d",
                display: "inline-block",
              }}
            >
              <FiHeart className="w-4 h-4 text-accent-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </motion.span>
            <span>for the campus community</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
