import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { GraduationCap } from 'lucide-react';
import { personalInfo } from '@/data/personal';

const coursework = [
  'Data Structures & Algorithms',
  'Objects & Design',
  'OOP',
  'Computer Systems',
  'Networking',
  'Architecture',
  'FPGA Design',
  'Linear Algebra',
];

export const About = () => {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader kicker="About" title="About Me" />
        </AnimatedSection>

        <div className="mt-16 grid gap-5 lg:grid-cols-5">
          <AnimatedSection delay={0.06} className="lg:col-span-3">
            <div className="surface h-full rounded-2xl p-8 md:p-10">
              <p className="eyebrow mb-6">Background</p>
              <div className="space-y-5 text-body-lg text-foreground/75">
                <p>{personalInfo.bio.intro}</p>
                <p>
                  Currently diving deep into{' '}
                  {personalInfo.bio.currentFocus.map((focus, index) => (
                    <span key={focus}>
                      <span className="font-medium text-foreground">{focus}</span>
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

          <AnimatedSection delay={0.12} className="lg:col-span-2">
            <div className="surface h-full rounded-2xl p-8 md:p-10">
              <p className="eyebrow mb-6">Education</p>

              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary p-2">
                  <img
                    src={`${import.meta.env.BASE_URL}logos/GT.png`}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-grow">
                  <h3 className="mb-1.5 text-title-sm font-semibold text-foreground">
                    Georgia Institute of Technology
                  </h3>
                  <p className="text-caption text-muted-foreground">
                    Expected May 2027 &nbsp;·&nbsp; GPA 4.0
                  </p>
                </div>
              </div>

              <div className="mb-7 space-y-1">
                <p className="text-body-sm font-medium text-foreground">
                  B.S. Computer Engineering
                </p>
                <p className="text-caption text-muted-foreground">
                  Threads: Cybersecurity &amp; Information Internetworks
                </p>
              </div>

              <div className="hairline mb-6" />

              <div>
                <p className="eyebrow mb-4 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Coursework</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {coursework.map((course) => (
                    <span key={course} className="chip">
                      {course}
                    </span>
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
