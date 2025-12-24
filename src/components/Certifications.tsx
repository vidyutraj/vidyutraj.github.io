import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Calendar, Award, ExternalLink } from 'lucide-react';
import { certifications } from '@/data/certifications';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + '-01');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (issueDate: string, expirationDate: string | null | undefined): string => {
  if (!expirationDate) return `Issued ${formatDate(issueDate)} - No expiration`;
  return `Issued ${formatDate(issueDate)} - Expires ${formatDate(expirationDate)}`;
};

export const Certifications = () => {
  // Sort by date (most recent first)
  const sortedCertifications = [...certifications].sort((a, b) => {
    const aDate = new Date(a.issueDate + '-01').getTime();
    const bDate = new Date(b.issueDate + '-01').getTime();
    return bDate - aDate;
  });

  return (
    <section id="certifications" className="relative py-32 md:py-40">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="cat certificates.txt"
            title="Certifications"
            description="The pieces of paper that prove I can actually do what I say I can do. Continuously learning and adding to the collection."
          />
        </AnimatedSection>

        {sortedCertifications.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <p className="text-muted-foreground text-center py-16">No certifications yet.</p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-16" staggerDelay={0.1}>
          {sortedCertifications.map((cert, index) => (
            <StaggerItem key={`${cert.name}-${cert.issuer}-${index}`}>
              <div className="p-7 rounded-xl bg-card border border-border/50 card-hover group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo */}
                  {cert.logo && (
                    <div className="flex-shrink-0">
                      <img 
                        src={cert.logo} 
                        alt={cert.logoAlt || `${cert.issuer} logo`}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="font-mono">{formatDateRange(cert.issueDate, cert.expirationDate)}</span>
                </div>

                {/* Credential Info */}
                {(cert.credentialId || cert.credentialUrl) && (
                  <div className="mt-auto pt-4 border-t border-border/30">
                    {cert.credentialId && (
                      <p className="text-xs text-muted-foreground mb-2 font-mono">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Verify Credential
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        )}
      </div>
    </section>
  );
};

