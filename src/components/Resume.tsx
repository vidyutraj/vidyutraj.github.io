import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { FileText, Download, GitBranch, RefreshCw } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const Resume = () => {
  return (
    <section id="resume" className="relative py-32 md:py-40 bg-card/20">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="./build-resume.sh"
            title="Resume"
            description="Auto-generated from source via CI/CD pipeline. Always up-to-date."
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 mt-16">
          {/* Resume preview card */}
          <AnimatedSection delay={0.1} direction="left">
            <div className="relative p-8 rounded-xl bg-card border border-border/50 overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              {/* Decorative terminal header */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-secondary/80 backdrop-blur-sm flex items-center gap-2 px-4 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-terminal-amber" />
                <div className="w-3 h-3 rounded-full bg-terminal-green" />
                <span className="ml-4 text-xs font-mono text-muted-foreground">resume.pdf</span>
              </div>

              {/* Mock resume content */}
              <div className="mt-12 space-y-6">
                <div>
                  <div className="h-8 bg-foreground/10 rounded w-48 mb-2" />
                  <div className="h-3 bg-foreground/5 rounded w-64" />
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-primary/20 rounded w-32" />
                  <div className="h-2 bg-foreground/5 rounded w-full" />
                  <div className="h-2 bg-foreground/5 rounded w-5/6" />
                  <div className="h-2 bg-foreground/5 rounded w-4/5" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-primary/20 rounded w-28" />
                  <div className="h-2 bg-foreground/5 rounded w-full" />
                  <div className="h-2 bg-foreground/5 rounded w-3/4" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-primary/20 rounded w-24" />
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-6 bg-foreground/10 rounded w-16" />
                    <div className="h-6 bg-foreground/10 rounded w-20" />
                    <div className="h-6 bg-foreground/10 rounded w-14" />
                    <div className="h-6 bg-foreground/10 rounded w-18" />
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 mt-8 bg-gradient-to-t from-card via-transparent to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="hero" size="lg" asChild>
                  <a href={`${import.meta.env.BASE_URL}${personalInfo.resume.pdfPath.startsWith('/') ? personalInfo.resume.pdfPath.slice(1) : personalInfo.resume.pdfPath}`} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-5 h-5" />
                    View Full Resume
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* CI/CD info */}
          <AnimatedSection delay={0.2} direction="right">
            <div className="space-y-6">
              <div className="p-8 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GitBranch className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">CI/CD Powered</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  This resume is automatically generated from LaTeX source using GitHub Actions. 
                  Every push to the resume repo triggers a build that produces a fresh PDF.
                </p>
                <div className="font-mono text-xs text-muted-foreground bg-secondary/50 p-3 rounded">
                  <div className="flex items-center gap-2 text-terminal-green">
                    <RefreshCw className="w-3 h-3" />
                    <span>Last build: 2 hours ago</span>
                  </div>
                  <div className="mt-1 text-foreground/60">
                    commit: feat: add cloud certifications section
                  </div>
                </div>
              </div>

              <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
                <StaggerItem>
                  <Button variant="hero" className="w-full" size="lg" asChild>
                    <a href={`${import.meta.env.BASE_URL}${personalInfo.resume.pdfPath.startsWith('/') ? personalInfo.resume.pdfPath.slice(1) : personalInfo.resume.pdfPath}`} download>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                  </Button>
                </StaggerItem>
                <StaggerItem>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <a href={personalInfo.resume.sourceRepo} target="_blank" rel="noopener noreferrer">
                      <GitBranch className="w-5 h-5" />
                      Source Repo
                    </a>
                  </Button>
                </StaggerItem>
              </StaggerContainer>

              {/* Pipeline steps */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="text-xs font-mono text-muted-foreground mb-3">Pipeline Steps</div>
                <div className="space-y-2">
                  {[
                    { step: 'Parse Markdown', status: 'done' },
                    { step: 'Apply Template', status: 'done' },
                    { step: 'Generate PDF', status: 'done' },
                    { step: 'Deploy to /resume', status: 'done' },
                  ].map((item, index) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-terminal-green/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-terminal-green" />
                      </div>
                      <span className="text-sm text-foreground/80">{item.step}</span>
                      <span className="ml-auto text-xs text-terminal-green font-mono">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
