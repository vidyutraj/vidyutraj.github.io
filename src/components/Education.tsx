import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Calendar, MapPin, GraduationCap, Award } from 'lucide-react';
import { education } from '@/data/education';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + '-01');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string => {
  if (!endDate) return `${formatDate(startDate)} - Present`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const Education = () => {
  // Sort by date (most recent first)
  const sortedEducation = [...education].sort((a, b) => {
    const aStart = new Date(a.startDate + '-01').getTime();
    const bStart = new Date(b.startDate + '-01').getTime();
    return bStart - aStart;
  });

  return (
    <section id="education" className="relative py-32 md:py-40 bg-card/20">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="cat education.txt"
            title="Education"
            description="Academic background and achievements."
          />
        </AnimatedSection>

        {sortedEducation.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <p className="text-muted-foreground text-center py-16">No education entries yet.</p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="space-y-8 mt-16" staggerDelay={0.1}>
          {sortedEducation.map((edu, index) => (
            <StaggerItem key={`${edu.institution}-${edu.degree}-${index}`}>
              <div className="p-7 rounded-xl bg-card border border-border/50 card-hover group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Logo */}
                  {edu.logo && (
                    <div className="flex-shrink-0">
                      <img 
                        src={edu.logo.startsWith('http') ? edu.logo : `${import.meta.env.BASE_URL}${edu.logo.startsWith('/') ? edu.logo.slice(1) : edu.logo}`}
                        alt={edu.logoAlt || `${edu.institution} logo`}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        {edu.website ? (
                          <a
                            href={edu.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                          >
                            <span>{edu.institution}</span>
                            <svg className="w-4 h-4 opacity-60 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            {edu.institution}
                          </h3>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span className="text-lg font-semibold text-foreground">{edu.degree}</span>
                          {edu.fieldOfStudy && (
                            <>
                              <span className="text-muted-foreground">in</span>
                              <span className="text-lg text-muted-foreground">{edu.fieldOfStudy}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date and Location */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{formatDateRange(edu.startDate, edu.endDate)}</span>
                      </div>
                      {edu.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{edu.location}</span>
                        </div>
                      )}
                      {edu.gpa && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">GPA:</span>
                          <span>{edu.gpa}</span>
                        </div>
                      )}
                    </div>

                    {/* Honors */}
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Award className="w-4 h-4 text-primary mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                          {edu.honors.map((honor, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                              {honor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coursework */}
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="pt-4 border-t border-border/30">
                        <p className="text-sm font-medium text-foreground mb-2">Relevant Coursework:</p>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((course, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs bg-secondary/50 text-muted-foreground rounded-md border border-border/50">
                              {course}
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

