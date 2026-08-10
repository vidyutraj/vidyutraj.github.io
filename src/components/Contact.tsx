import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, BookOpen, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';
import { useTransitions } from '@/lib/motion';

export const Contact = () => {
  const t = useTransitions();

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: t.reduced ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { ...t.gentle, delay },
  });

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      {/* The same light source as the hero, closing the page where it opened */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px] bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.10),transparent_62%)]"
      />

      <div className="container relative max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader kicker="Connect" title="Let's build something" />
        </AnimatedSection>

        <div className="mt-14 max-w-3xl">
          <motion.p {...reveal()} className="mb-10 text-body-lg text-foreground/75">
            Open to discussing opportunities, collaborations, or interesting security
            challenges. Always happy to chat.
          </motion.p>

          <motion.div
            {...reveal(0.06)}
            className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button variant="hero" size="lg" asChild className="group">
              <a href={`mailto:${personalInfo.social.email}`}>
                <Mail />
                Send an email
                <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
            <p className="text-caption text-muted-foreground">
              Or ask the assistant in the bottom corner.
            </p>
          </motion.div>

          <motion.a
            {...reveal(0.12)}
            href={`mailto:${personalInfo.social.email}`}
            className="press group block"
          >
            <p className="eyebrow mb-3">Direct</p>
            <span className="flex flex-wrap items-center gap-3 text-display-sm font-medium text-foreground/90 group-hover:text-primary">
              <span className="underline decoration-border decoration-1 underline-offset-8 group-hover:decoration-primary/60">
                {personalInfo.social.email}
              </span>
              <ArrowUpRight className="h-6 w-6 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  const socialLinks = [
    { name: 'GitHub', url: personalInfo.social.github, icon: Github },
    { name: 'LinkedIn', url: personalInfo.social.linkedin, icon: Linkedin },
    { name: 'Medium', url: personalInfo.social.medium, icon: BookOpen },
  ];

  return (
    <footer className="relative border-t border-border/60 py-9">
      <div className="container max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-caption font-semibold text-foreground">
              V
            </span>
            <p className="text-caption text-muted-foreground">
              © {new Date().getFullYear()} {personalInfo.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="press rounded-full p-2.5 text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                aria-label={social.name}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
