import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Terminal, GraduationCap, Calendar } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const About = () => {
  return (
    <section id="about" className="relative py-32 md:py-40">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="cat about.md"
            title="About Me"
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Bio section */}
          <AnimatedSection delay={0.1}>
            <div className="h-full p-8 rounded-xl bg-card border border-border/50 shadow-lg shadow-background/50">
              <div className="flex items-center gap-2 mb-6 font-mono text-sm text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>background.log</span>
              </div>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
                <p>{personalInfo.bio.intro}</p>
                <p>
                  Currently diving deep into{' '}
                  {personalInfo.bio.currentFocus.map((focus, index) => (
                    <span key={focus}>
                      <span className="text-foreground font-medium">{focus}</span>
                      {index < personalInfo.bio.currentFocus.length - 1 && ', '}
                      {index === personalInfo.bio.currentFocus.length - 2 && ' and '}
                    </span>
                  ))}
                  .
                </p>
                <p>{personalInfo.bio.interests}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Education section */}
          <AnimatedSection delay={0.2}>
            <div className="h-full p-8 rounded-xl bg-card border border-border/50 shadow-lg shadow-background/50 card-hover group">
              <div className="flex items-center gap-2 mb-6 font-mono text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>education.log</span>
              </div>
              
              <div className="space-y-6">
                {/* Logo and Institution */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src="/logos/GT.png" 
                      alt="Georgia Tech Logo"
                      className="w-16 h-16 object-contain rounded-lg bg-white/5 p-2 border border-border/30 group-hover:border-primary/30 transition-colors"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      Georgia Institute of Technology
                    </h3>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm font-mono">Expected May 2027</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">GPA:</span>
                        <span className="text-sm font-mono">4.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Degree Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <p className="text-base font-semibold text-foreground">
                      B.S. in Computer Engineering
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground ml-3.5">
                    Threads in Cybersecurity and Information Internetworks
                  </p>
                </div>
                
                {/* Coursework */}
                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    Relevant Coursework
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Data Structures & Algorithms',
                      'Objects & Design',
                      'Object-Oriented Programming',
                      'Computer Systems Programming',
                      'Computer Networking',
                      'Computer Architecture',
                      'FPGA Design',
                      'Linear Algebra',
                    ].map((course) => (
                      <span
                        key={course}
                        className="px-3 py-1.5 text-xs bg-secondary/50 text-muted-foreground rounded-md border border-border/50 hover:border-primary/30 hover:bg-secondary/70 hover:text-foreground transition-all duration-200"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
