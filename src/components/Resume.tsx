import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { FileText, Download, GitBranch } from 'lucide-react';
import { personalInfo } from '@/data/personal';

const resumeHref = `${import.meta.env.BASE_URL}${
  personalInfo.resume.pdfPath.startsWith('/')
    ? personalInfo.resume.pdfPath.slice(1)
    : personalInfo.resume.pdfPath
}`;

export const Resume = () => {
  return (
    <section id="resume" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Document"
            title="Resume"
            description="The short version, as a PDF."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <AnimatedSection delay={0.06} direction="left">
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-interactive press-soft press group block overflow-hidden rounded-2xl p-8"
              aria-label="Open the resume PDF"
            >
              {/* Stand-in for the document itself — shape only, no invented content */}
              <div className="space-y-6" aria-hidden="true">
                <div>
                  <div className="mb-2 h-7 w-48 rounded bg-foreground/10" />
                  <div className="h-3 w-64 rounded bg-foreground/[0.06]" />
                </div>
                {[5, 3].map((rows) => (
                  <div key={rows} className="space-y-2">
                    <div className="h-3.5 w-28 rounded bg-primary/25" />
                    {Array.from({ length: rows }).map((_, i) => (
                      <div
                        key={i}
                        className="h-2 rounded bg-foreground/[0.06]"
                        style={{ width: `${100 - i * 8}%` }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2 text-body-sm font-medium text-muted-foreground group-hover:text-primary">
                <FileText className="h-4 w-4" />
                View full resume
              </div>
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.12} direction="right">
            <div className="surface flex h-full flex-col justify-center gap-4 rounded-2xl p-8">
              <p className="text-body text-muted-foreground">
                Prefer a copy? Download the PDF, or browse the source repositories behind the
                projects listed above.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" asChild>
                  <a href={resumeHref} download>
                    <Download />
                    Download PDF
                  </a>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <a
                    href={personalInfo.resume.sourceRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitBranch />
                    Source repo
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
