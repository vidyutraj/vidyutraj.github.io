import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader, TechBadge } from '@/components/SectionHeader';
import { MapPin, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { experiences, CompanyExperience, Role } from '@/data/experience';
import { useState } from 'react';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + '-01'); // Add day for parsing
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} – ${end}`;
};

const getEmploymentTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    'Full-time': 'bg-primary/20 text-primary border-primary/30',
    'Part-time': 'bg-accent/20 text-accent border-accent/30',
    'Internship': 'bg-terminal-amber/20 text-terminal-amber border-terminal-amber/30',
    'Co-op': 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
    'Contract': 'bg-muted text-muted-foreground border-border',
    'Self-employed': 'bg-primary/20 text-primary border-primary/30',
  };
  return colors[type] || colors['Contract'];
};

// Get the earliest start date and latest end date for a company
const getCompanyDateRange = (company: CompanyExperience): { start: string; end: string | null } => {
  // Use manual dates if provided
  if (company.startDate) {
    return {
      start: company.startDate,
      end: company.endDate ?? null,
    };
  }
  
  // Otherwise calculate from roles
  const dates = company.roles.map(role => ({
    start: new Date(role.startDate + '-01'),
    end: role.endDate ? new Date(role.endDate + '-01') : new Date(),
  }));
  
  const earliestStart = new Date(Math.min(...dates.map(d => d.start.getTime())));
  const hasCurrent = company.roles.some(role => role.endDate === null);
  const latestEnd = hasCurrent ? null : new Date(Math.max(...dates.map(d => d.end.getTime())));
  
  return {
    start: `${earliestStart.getFullYear()}-${String(earliestStart.getMonth() + 1).padStart(2, '0')}`,
    end: latestEnd ? `${latestEnd.getFullYear()}-${String(latestEnd.getMonth() + 1).padStart(2, '0')}` : null,
  };
};

// Sort experiences by date (most recent first)
const sortedExperiences = [...experiences].sort((a, b) => {
  const aRange = getCompanyDateRange(a);
  const bRange = getCompanyDateRange(b);
  const aStart = new Date(aRange.start + '-01').getTime();
  const bStart = new Date(bRange.start + '-01').getTime();
  return bStart - aStart; // Descending order
});

export const Experience = () => {
  return (
    <section id="experience" className="relative py-32 md:py-40 bg-card/20">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="cat experience.log"
            title="Experience"
            description="Where I've worked, what I've built, and the problems I've solved. From internships to research—here's the journey so far."
          />
        </AnimatedSection>

        {/* Timeline */}
        <div className="mt-16 relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border/50"></div>

          <div className="space-y-8">
            {sortedExperiences.map((company, companyIndex) => (
              <TimelineEntry 
                key={company.company} 
                company={company}
                index={companyIndex}
                total={sortedExperiences.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineEntry = ({ 
  company, 
  index, 
  total 
}: { 
  company: CompanyExperience; 
  index: number;
  total: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateRange = getCompanyDateRange(company);

  return (
    <AnimatedSection delay={index * 0.1}>
      <div className="relative pl-12 md:pl-16">
        {/* Timeline dot */}
        <div className="absolute left-0 md:left-4 top-2 -translate-x-1/2">
          <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg"></div>
        </div>

        {/* Clickable company header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 flex-grow">
              {/* Company Logo */}
              {company.logo ? (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white dark:bg-secondary/50 p-1.5 flex items-center justify-center border border-border/50 shadow-sm overflow-hidden flex-shrink-0">
                  <img 
                    src={company.logo.startsWith('http') ? company.logo : `${import.meta.env.BASE_URL}${company.logo.startsWith('/') ? company.logo.slice(1) : company.logo}`}
                    alt={company.logoAlt || `${company.company} logo`}
                    className="w-full h-full object-contain object-center"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center border border-border/50 flex-shrink-0">
                  <Building2 className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
              )}

              {/* Company Name and Date */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg md:text-xl font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group/link"
                    >
                      <span>{company.company}</span>
                      <svg className="w-4 h-4 opacity-60 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {company.company}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">
                    {formatDateRange(dateRange.start, dateRange.end)}
                  </span>
                  {company.totalDuration && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground">{company.totalDuration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-6 pt-2 pb-4">
            {company.roles.map((role, roleIndex) => (
              <RoleDetails 
                key={`${role.position}-${role.startDate}`} 
                role={role}
                roleIndex={roleIndex}
                totalRoles={company.roles.length}
              />
            ))}
          </div>
        </div>

        {/* Divider (except last) */}
        {index < total - 1 && (
          <div className="pt-8"></div>
        )}
      </div>
    </AnimatedSection>
  );
};

const RoleDetails = ({ role, roleIndex, totalRoles }: { role: Role; roleIndex: number; totalRoles: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreDetails = role.fullDetails.length > role.defaultBullets.length;

  return (
    <div className={`${roleIndex > 0 ? 'pt-6 border-t border-border/30' : ''}`}>
      {/* Role Header */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="text-base md:text-lg font-semibold text-foreground">{role.position}</h4>
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getEmploymentTypeColor(role.employmentType)}`}>
            {role.employmentType}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="font-mono">{formatDateRange(role.startDate, role.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{role.location}</span>
            {role.workType && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span>{role.workType}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bullets */}
      <div className="space-y-2.5">
        {role.defaultBullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-muted-foreground leading-relaxed">
            <span className="text-primary mt-1.5 flex-shrink-0">•</span>
            <span>{bullet}</span>
          </div>
        ))}

        {/* Additional details (expandable) */}
        {hasMoreDetails && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2.5 pt-1">
              {role.fullDetails.slice(role.defaultBullets.length).map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                  <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View more details button */}
      {hasMoreDetails && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 mt-3 -ml-1 px-1 py-1.5 rounded-md hover:bg-primary/5"
        >
          <span>{isExpanded ? 'Show less' : 'View more details'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          )}
        </button>
      )}

      {/* Technologies */}
      {role.technologies && role.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30 mt-4">
          {role.technologies.map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
        </div>
      )}
    </div>
  );
};
