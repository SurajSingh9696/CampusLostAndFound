'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  
  const display = useTransform(spring, (latest) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return prefix + Math.floor(latest).toLocaleString() + suffix;
  });

  useEffect(() => {
    if (isInView) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      spring.set(numValue);
    }
  }, [isInView, value, spring]);

  return (
    <motion.span ref={ref}>
      {display}
    </motion.span>
  );
}
