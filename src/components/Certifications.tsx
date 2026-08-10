import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ExternalLink } from 'lucide-react';
import { certifications } from '@/data/certifications';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01`);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (issueDate: string, expirationDate: string | null | undefined): string =>
  expirationDate
    ? `Issued ${formatDate(issueDate)} · Expires ${formatDate(expirationDate)}`
    : `Issued ${formatDate(issueDate)} · No expiration`;

export const Certifications = () => {
  const sorted = [...certifications].sort(
    (a, b) => new Date(`${b.issueDate}-01`).getTime() - new Date(`${a.issueDate}-01`).getTime(),
  );

  return (
    <section id="certifications" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Credentials"
            title="Certifications"
            description="The pieces of paper that prove I can actually do what I say I can do. Continuously learning and adding to the collection."
          />
        </AnimatedSection>

        {sorted.length === 0 ? (
          <AnimatedSection delay={0.06}>
            <p className="py-16 text-center text-body text-muted-foreground">
              No certifications yet.
            </p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="mt-14 grid gap-4 md:grid-cols-2">
            {sorted.map((cert, index) => (
              <StaggerItem key={`${cert.name}-${cert.issuer}-${index}`}>
                <article className="surface-interactive group flex h-full flex-col rounded-2xl p-7">
                  <div className="mb-5 flex items-start gap-4">
                    {cert.logo && (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
                        <img
                          src={
                            cert.logo.startsWith('http')
                              ? cert.logo
                              : `${import.meta.env.BASE_URL}${
                                  cert.logo.startsWith('/') ? cert.logo.slice(1) : cert.logo
                                }`
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-grow">
                      <h3 className="mb-1 text-title-sm font-semibold text-foreground">
                        {cert.name}
                      </h3>
                      <p className="text-body-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                  </div>

                  <p className="text-caption text-muted-foreground">
                    {formatDateRange(cert.issueDate, cert.expirationDate)}
                  </p>

                  {(cert.credentialId || cert.credentialUrl) && (
                    <div className="mt-auto border-t border-border/60 pt-4">
                      {cert.credentialId && (
                        <p className="mb-2 font-mono text-caption text-muted-foreground/70">
                          ID {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground hover:text-primary"
                        >
                          Verify credential
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
};
