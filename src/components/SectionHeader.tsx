import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTransitions } from '@/lib/motion';

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Short kicker above the title (e.g. "Selected Work"). Name it for what's there. */
  kicker?: string;
}

/**
 * Section headers do one job: say where you are and what's here. Hierarchy
 * comes from size, weight and leading — there is no rule, no index badge and
 * no readout, because none of those told you anything.
 */
export const SectionHeader = ({ title, description, kicker }: SectionHeaderProps) => {
  const t = useTransitions();

  return (
    <header className="max-w-3xl">
      {kicker && (
        <motion.p
          initial={{ opacity: 0, y: t.reduced ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={t.standard}
          className="eyebrow mb-4"
        >
          {kicker}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: t.reduced ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={t.gentle}
        className="text-display font-semibold gradient-text"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: t.reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ ...t.gentle, delay: 0.06 }}
          className="mt-5 text-body-lg text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </header>
  );
};

interface TechBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export const TechBadge = ({ children, icon }: TechBadgeProps) => (
  <span className="chip">
    {icon}
    {children}
  </span>
);
