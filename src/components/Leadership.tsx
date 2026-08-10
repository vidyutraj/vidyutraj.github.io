import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowUpRight } from 'lucide-react';
import { leadership } from '@/data/leadership';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01`);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: string, endDate: string | null): string =>
  endDate ? `${formatDate(startDate)} — ${formatDate(endDate)}` : `${formatDate(startDate)} — Present`;

export const Leadership = () => {
  const sorted = [...leadership].sort(
    (a, b) => new Date(`${b.startDate}-01`).getTime() - new Date(`${a.startDate}-01`).getTime(),
  );

  return (
    <section id="leadership" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Roles"
            title="Leadership"
            description="Leading teams, organizing initiatives, and making things happen. From consulting to student orgs — here's where I've stepped up."
          />
        </AnimatedSection>

        {sorted.length === 0 ? (
          <AnimatedSection delay={0.06}>
            <p className="py-16 text-center text-body text-muted-foreground">
              No leadership positions yet.
            </p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="mt-14 space-y-4">
            {sorted.map((lead, index) => (
              <StaggerItem key={`${lead.organization}-${lead.position}-${index}`}>
                <article className="surface-interactive rounded-2xl p-7 md:p-9">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {lead.logo && (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
                        <img
                          src={
                            lead.logo.startsWith('http')
                              ? lead.logo
                              : `${import.meta.env.BASE_URL}${
                                  lead.logo.startsWith('/') ? lead.logo.slice(1) : lead.logo
                                }`
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-grow">
                      <div className="mb-3">
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press group/link inline-flex items-center gap-1.5 text-title font-semibold text-foreground hover:text-primary"
                          >
                            <span>{lead.organization}</span>
                            <ArrowUpRight className="h-4 w-4 opacity-50 transition-opacity group-hover/link:opacity-100" />
                          </a>
                        ) : (
                          <h3 className="text-title font-semibold text-foreground">
                            {lead.organization}
                          </h3>
                        )}
                        <p className="mt-1 text-body font-medium text-primary">{lead.position}</p>
                      </div>

                      <p className="mb-5 text-caption text-muted-foreground">
                        {formatDateRange(lead.startDate, lead.endDate)}
                        {lead.location && ` · ${lead.location}`}
                      </p>

                      {lead.description && lead.description.length > 0 && (
                        <ul className="mb-5 space-y-2.5">
                          {lead.description.map((desc, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-body-sm text-muted-foreground"
                            >
                              <span className="mt-[0.6em] block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/60" />
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {lead.achievements && lead.achievements.length > 0 && (
                        <div className="border-t border-border/60 pt-4">
                          <p className="eyebrow mb-3">Key achievements</p>
                          <div className="flex flex-wrap gap-1.5">
                            {lead.achievements.map((achievement, idx) => (
                              <span key={idx} className="chip">
                                {achievement}
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
