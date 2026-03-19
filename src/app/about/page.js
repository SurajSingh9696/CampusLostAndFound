'use client';

import { motion } from 'framer-motion';
import {
  FiTarget,
  FiHeart,
  FiUsers,
  FiAward,
  FiShield,
  FiZap,
  FiTrendingUp,
  FiCheckCircle,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from 'react-icons/fi';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: FiZap,
      title: 'Fast & Efficient',
      description: 'Quick item posting and real-time search to reunite lost items with their owners faster.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Protected user data with authentication and verification to ensure safe transactions.',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description: 'Built for the campus community, helping students and staff support each other.',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      icon: FiAward,
      title: 'Reputation System',
      description: 'Reward helpful community members with a transparent reputation scoring system.',
      color: 'from-neutral-600 to-neutral-700',
      bgColor: 'bg-neutral-50',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Items Recovered', icon: FiCheckCircle },
    { value: '5000+', label: 'Active Users', icon: FiUsers },
    { value: '98%', label: 'Success Rate', icon: FiTrendingUp },
    { value: '24/7', label: 'Support Available', icon: FiHeart },
  ];

  const team = [
    {
      name: 'Campus Lost & Found Team',
      role: 'Development & Support',
      description: 'Passionate about helping the campus community stay connected and recover lost items.',
    },
  ];

  const values = [
    {
      title: 'Integrity',
      description: 'We maintain honesty and transparency in every interaction.',
      icon: FiShield,
    },
    {
      title: 'Community First',
      description: 'Building tools that serve the needs of our campus community.',
      icon: FiUsers,
    },
    {
      title: 'Innovation',
      description: 'Constantly improving our platform with new features and technologies.',
      icon: FiZap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-xl border-2 border-white/30"
            >
              <FiHeart className="w-10 h-10" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              About Campus Lost & Found
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Connecting our campus community through a professional platform designed to reunite lost items with their rightful owners.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
                <FiTarget className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Our Mission</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                Reuniting You With What Matters
              </h2>

              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                Campus Lost & Found was created to solve a common problem faced by students, faculty, and staff every day. We understand the stress and frustration of losing personal belongings, and we're here to make the recovery process seamless and efficient.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Our platform leverages modern technology to create a centralized hub where the campus community can report lost items, browse found items, and connect with each other to ensure belongings find their way home.
              </p>
            </div>

            <div className="relative">
              <motion.div
                className="relative h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl shadow-2xl border-2 border-neutral-200/50 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                      <FiHeart className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">Building Connections</h3>
                    <p className="text-neutral-700">One item at a time</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 text-center hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <Icon className="w-10 h-10 mx-auto mb-4 text-primary-600" />
                  <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-neutral-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We've built a platform that combines simplicity with powerful features to serve our campus community better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border-2 border-white/30"
            >
              <FiHeart className="w-8 h-8" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Join Our Community Today
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of a community that cares. Help your fellow students and staff recover their lost belongings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <motion.button
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-xl hover:bg-neutral-50 transition-colors duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
              </Link>

              <Link href="/browse">
                <motion.button
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/30 transition-colors duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Items
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div className="flex items-center justify-center space-x-6">
            <motion.a
              href="mailto:support@campuslostandfound.com"
              className="flex items-center space-x-2 px-6 py-3 bg-primary-50 text-primary-600 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMail className="w-5 h-5" />
              <span>Email Us</span>
            </motion.a>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <motion.a
              href="https://github.com/SurajSingh9696"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-neutral-100 hover:bg-primary-50 rounded-xl flex items-center justify-center text-neutral-600 hover:text-primary-600 transition-colors duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiGithub className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="#"
              className="w-12 h-12 bg-neutral-100 hover:bg-primary-50 rounded-xl flex items-center justify-center text-neutral-600 hover:text-primary-600 transition-colors duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLinkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="#"
              className="w-12 h-12 bg-neutral-100 hover:bg-primary-50 rounded-xl flex items-center justify-center text-neutral-600 hover:text-primary-600 transition-colors duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiTwitter className="w-6 h-6" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
