'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';

interface RabbitCelebrationProps {
  onDismiss: () => void;
}

export default function RabbitCelebration({ onDismiss }: RabbitCelebrationProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onDismiss]);

  const overlayVariants: Variants = prefersReducedMotion
    ? { hidden: {}, visible: {}, exit: {} }
    : { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

  const contentVariants: Variants = prefersReducedMotion
    ? { hidden: {}, visible: {}, exit: {} }
    : {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.92 },
      };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Celebration"
      onClick={onDismiss}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-overlay)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, delay: 0.05 }}
        style={{ textAlign: 'center', pointerEvents: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/WhiteRabbit.png"
          alt="Celebrating rabbit"
          style={{ width: 200, height: 200, display: 'block', margin: '0 auto 24px', objectFit: 'contain' }}
        />

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 8px',
          }}
        >
          You did the thing. 🌟
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          The ONE thing. That&apos;s everything.
        </p>
      </motion.div>
    </motion.div>
  );
}
