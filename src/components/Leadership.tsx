import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Calendar, MapPin, Users } from 'lucide-react';
import { leadership } from '@/data/leadership';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + '-01');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string => {
  if (!endDate) return `${formatDate(startDate)} - Present`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const Leadership = () => {
  // Sort by date (most recent first)
  const sortedLeadership = [...leadership].sort((a, b) => {
    const aStart = new Date(a.startDate + '-01').getTime();
    const bStart = new Date(b.startDate + '-01').getTime();
    return bStart - aStart;
  });

  return (
    <section id="leadership" className="relative py-32 md:py-40 bg-card/20">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="cat leadership.txt"
            title="Leadership"
            description="Leading teams, organizing initiatives, and making things happen. From consulting to student orgs—here's where I've stepped up."
          />
        </AnimatedSection>

        {sortedLeadership.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <p className="text-muted-foreground text-center py-16">No leadership positions yet.</p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="space-y-6 mt-16" staggerDelay={0.1}>
          {sortedLeadership.map((lead, index) => (
            <StaggerItem key={`${lead.organization}-${lead.position}-${index}`}>
              <div className="p-7 rounded-xl bg-card border border-border/50 card-hover group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Logo */}
                  {lead.logo && (
                    <div className="flex-shrink-0">
                      <img 
                        src={lead.logo} 
                        alt={lead.logoAlt || `${lead.organization} logo`}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                          >
                            <span>{lead.organization}</span>
                            <svg className="w-4 h-4 opacity-60 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            {lead.organization}
                          </h3>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-lg font-semibold text-foreground">{lead.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date and Location */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{formatDateRange(lead.startDate, lead.endDate)}</span>
                      </div>
                      {lead.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{lead.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {lead.description && lead.description.length > 0 && (
                      <div className="space-y-2.5 mb-4">
                        {lead.description.map((desc, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                            <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                            <span>{desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Achievements */}
                    {lead.achievements && lead.achievements.length > 0 && (
                      <div className="pt-4 border-t border-border/30">
                        <p className="text-sm font-medium text-foreground mb-2">Key Achievements:</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.achievements.map((achievement, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        )}
      </div>
    </section>
  );
};

