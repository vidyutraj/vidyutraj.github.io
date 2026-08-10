import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowUpRight } from 'lucide-react';
import { education } from '@/data/education';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01`);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string =>
  endDate ? `${formatDate(startDate)} — ${formatDate(endDate)}` : `${formatDate(startDate)} — Present`;

export const Education = () => {
  const sorted = [...education].sort(
    (a, b) => new Date(`${b.startDate}-01`).getTime() - new Date(`${a.startDate}-01`).getTime(),
  );

  return (
    <section id="education" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Academics"
            title="Education"
            description="Academic background and achievements."
          />
        </AnimatedSection>

        {sorted.length === 0 ? (
          <AnimatedSection delay={0.06}>
            <p className="py-16 text-center text-body text-muted-foreground">
              No education entries yet.
            </p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="mt-14 space-y-4">
            {sorted.map((edu, index) => (
              <StaggerItem key={`${edu.institution}-${edu.degree}-${index}`}>
                <article className="surface-interactive rounded-2xl p-7 md:p-9">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {edu.logo && (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
                        <img
                          src={
                            edu.logo.startsWith('http')
                              ? edu.logo
                              : `${import.meta.env.BASE_URL}${
                                  edu.logo.startsWith('/') ? edu.logo.slice(1) : edu.logo
                                }`
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-grow">
                      {edu.website ? (
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press group/link inline-flex items-center gap-1.5 text-title font-semibold text-foreground hover:text-primary"
                        >
                          <span>{edu.institution}</span>
                          <ArrowUpRight className="h-4 w-4 opacity-50 transition-opacity group-hover/link:opacity-100" />
                        </a>
                      ) : (
                        <h3 className="text-title font-semibold text-foreground">
                          {edu.institution}
                        </h3>
                      )}

                      <p className="mt-1 text-body font-medium text-foreground/85">
                        {edu.degree}
                        {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                      </p>

                      <p className="mt-2 text-caption text-muted-foreground">
                        {formatDateRange(edu.startDate, edu.endDate)}
                        {edu.location && ` · ${edu.location}`}
                        {edu.gpa && ` · GPA ${edu.gpa}`}
                      </p>

                      {edu.honors && edu.honors.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {edu.honors.map((honor, idx) => (
                            <span key={idx} className="chip">
                              {honor}
                            </span>
                          ))}
                        </div>
                      )}

                      {edu.coursework && edu.coursework.length > 0 && (
                        <div className="mt-5 border-t border-border/60 pt-5">
                          <p className="eyebrow mb-3">Relevant coursework</p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.coursework.map((course, idx) => (
                              <span key={idx} className="chip">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
};
