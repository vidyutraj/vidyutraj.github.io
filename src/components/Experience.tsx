import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader, TechBadge } from '@/components/SectionHeader';
import { Building2, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { experiences, CompanyExperience, Role } from '@/data/experience';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransitions } from '@/lib/motion';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01`);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string =>
  `${formatDate(startDate)} — ${endDate ? formatDate(endDate) : 'Present'}`;

const getCompanyDateRange = (company: CompanyExperience): { start: string; end: string | null } => {
  if (company.startDate) {
    return { start: company.startDate, end: company.endDate ?? null };
  }

  const dates = company.roles.map((role) => ({
    start: new Date(`${role.startDate}-01`),
    end: role.endDate ? new Date(`${role.endDate}-01`) : new Date(),
  }));

  const earliestStart = new Date(Math.min(...dates.map((d) => d.start.getTime())));
  const hasCurrent = company.roles.some((role) => role.endDate === null);
  const latestEnd = hasCurrent ? null : new Date(Math.max(...dates.map((d) => d.end.getTime())));

  const stamp = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  return { start: stamp(earliestStart), end: latestEnd ? stamp(latestEnd) : null };
};

const sortedExperiences = [...experiences].sort(
  (a, b) =>
    new Date(`${getCompanyDateRange(b).start}-01`).getTime() -
    new Date(`${getCompanyDateRange(a).start}-01`).getTime(),
);

export const Experience = () => {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Career"
            title="Experience"
            description="Where I've worked, what I've built, and the problems I've solved. From internships to research — here's the journey so far."
          />
        </AnimatedSection>

        <div className="relative mt-14">
          {/* Timeline rail */}
          <div className="absolute bottom-3 left-[11px] top-3 w-px bg-border md:left-[19px]" />

          <div className="space-y-12">
            {sortedExperiences.map((company, companyIndex) => (
              <TimelineEntry key={company.company} company={company} index={companyIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineEntry = ({ company, index }: { company: CompanyExperience; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const dateRange = getCompanyDateRange(company);
  const isCurrent = dateRange.end === null;
  const t = useTransitions();

  const logoSrc = company.logo?.startsWith('http')
    ? company.logo
    : company.logo &&
      `${import.meta.env.BASE_URL}${company.logo.startsWith('/') ? company.logo.slice(1) : company.logo}`;

  return (
    <AnimatedSection delay={index * 0.06}>
      <div className="relative pl-10 md:pl-16">
        {/* Timeline node — a marker, not an indicator light */}
        <div className="absolute left-0 top-3 md:left-2">
          <div
            className={`h-5 w-5 rounded-full border-2 ${
              isCurrent ? 'border-primary bg-primary/25' : 'border-border bg-card'
            }`}
          />
        </div>

        <button
          onClick={() => setIsExpanded((open) => !open)}
          className="press group w-full rounded-xl text-left"
          aria-expanded={isExpanded}
        >
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="flex min-w-0 flex-grow items-center gap-4">
              {logoSrc ? (
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2">
                  <img
                    src={logoSrc}
                    alt={company.logoAlt || `${company.company} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              <div className="min-w-0 flex-grow">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="press inline-flex items-center gap-1.5 text-title font-semibold text-foreground hover:text-primary"
                  >
                    <span>{company.company}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-50" />
                  </a>
                ) : (
                  <h3 className="text-title font-semibold text-foreground group-hover:text-primary">
                    {company.company}
                  </h3>
                )}
                <p className="mt-1 text-caption text-muted-foreground">
                  {formatDateRange(dateRange.start, dateRange.end)}
                  {company.totalDuration && ` · ${company.totalDuration}`}
                  {isCurrent && <span className="text-primary"> · Current</span>}
                </p>
              </div>
            </div>

            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={t.snappy}
              className="mt-1.5 flex-shrink-0 text-muted-foreground group-hover:text-foreground"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={t.standard}
              className="overflow-hidden"
            >
              <div className="space-y-8 pt-6">
                {company.roles.map((role, roleIndex) => (
                  <RoleDetails
                    key={`${role.position}-${role.startDate}`}
                    role={role}
                    roleIndex={roleIndex}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
};

const RoleDetails = ({ role, roleIndex }: { role: Role; roleIndex: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreDetails = role.fullDetails.length > role.defaultBullets.length;
  const hasAnyBullets = role.defaultBullets.length > 0 || role.fullDetails.length > 0;
  const t = useTransitions();

  return (
    <div className={`relative border-l border-border pl-5 ${roleIndex > 0 ? 'pt-8' : ''}`}>
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-border bg-card" />

      <div className="mb-5 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-title-sm font-semibold text-foreground">{role.position}</h4>
          <span className="chip">{role.employmentType}</span>
        </div>
        <p className="text-caption text-muted-foreground">
          {formatDateRange(role.startDate, role.endDate)}
          {role.location && ` · ${role.location}`}
          {role.workType && ` · ${role.workType}`}
        </p>
      </div>

      {hasAnyBullets && (
        <div className="space-y-3">
          <Bullets items={role.defaultBullets} />

          <AnimatePresence initial={false}>
            {hasMoreDetails && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={t.standard}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <Bullets items={role.fullDetails.slice(role.defaultBullets.length)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {hasMoreDetails && (
        <button
          onClick={() => setIsExpanded((open) => !open)}
          className="press mt-4 flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary"
        >
          <span>{isExpanded ? 'Show less' : 'View details'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      )}

      {role.technologies && role.technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-5">
          {role.technologies.map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
        </div>
      )}
    </div>
  );
};

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-3 text-body-sm text-muted-foreground">
        <span className="mt-[0.6em] block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/60" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);
