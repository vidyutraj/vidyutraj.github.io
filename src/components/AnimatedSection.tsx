import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { useTransitions } from '@/lib/motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

/**
 * Scroll reveals. Springs rather than fixed-duration curves, so a reveal that
 * is still settling when the next one starts stays continuous instead of
 * queueing. Under reduced motion these collapse to a plain cross-fade.
 */
export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const t = useTransitions();

  const offset = () => {
    if (t.reduced) return { x: 0, y: 0 };
    switch (direction) {
      case 'left':
        return { x: -28, y: 0 };
      case 'right':
        return { x: 28, y: 0 };
      case 'up':
        return { x: 0, y: 28 };
      case 'none':
        return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ ...t.gentle, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className = '',
  staggerDelay = 0.06,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const t = useTransitions();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: t.reduced ? 0 : staggerDelay,
            delayChildren: 0.04,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const t = useTransitions();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: t.reduced ? 0 : 20 },
        visible: { opacity: 1, y: 0, transition: t.standard },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
