import { ReactNode } from 'react';

interface SectionHeaderProps {
  command: string;
  title: string;
  description?: string;
}

export const SectionHeader = ({ command, title, description }: SectionHeaderProps) => (
  <div className="mb-16 group">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-accent font-mono text-sm">$</span>
      <span className="text-primary font-mono text-sm group-hover:text-primary/80 transition-colors">{command}</span>
      <span className="w-2 h-4 bg-primary/80 animate-blink" />
    </div>
    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight group-hover:text-primary/90 transition-colors duration-300">
      {title}
    </h2>
    {description && (
      <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

interface TechBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export const TechBadge = ({ children, icon }: TechBadgeProps) => (
  <span className="tech-badge">
    {icon}
    {children}
  </span>
);

export const GlowOrb = ({ className = '' }: { className?: string }) => (
  <div 
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    style={{
      background: 'radial-gradient(circle, hsl(var(--glow-primary)) 0%, transparent 70%)',
    }}
  />
);
