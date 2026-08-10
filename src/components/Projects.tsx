import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  Github,
  ExternalLink,
  ChevronDown,
  Trophy,
  Video,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader, TechBadge } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';
import { personalInfo } from '@/data/personal';
import { useIsMobile } from '@/hooks/use-mobile';
import { nearestSnap, project as projectMomentum, spring, useTransitions } from '@/lib/motion';

/** Titles promoted to the featured band. Ordered by priority. */
const FEATURED_TITLES = [
  'AI Cyber Threat Intelligence Dashboard',
  'UPS Airlines OptiFlight',
  'SimpliEarn',
];

type Project = (typeof projects)[0];

/* ───────────────────────── Featured card ───────────────────────── */

const LINK_KINDS = [
  { key: 'githubUrl', icon: Github, label: 'GitHub' },
  { key: 'demoUrl', icon: ExternalLink, label: 'Live demo' },
  { key: 'videoUrl', icon: Video, label: 'Video' },
  { key: 'slidesUrl', icon: FileText, label: 'Slides' },
] as const;

const FeaturedCard = ({ project }: { project: Project }) => (
  <article className="surface-interactive group flex h-full flex-col rounded-2xl p-7 md:p-8">
    <p className="eyebrow mb-4">{project.category}</p>

    <h3 className="mb-4 text-title font-semibold text-foreground group-hover:text-primary">
      {project.title}
    </h3>

    <p className="mb-6 flex-grow text-body-sm text-muted-foreground">{project.description}</p>

    <div className="mb-6 space-y-3 border-l border-border pl-4">
      <div>
        <p className="eyebrow mb-1">Problem</p>
        <p className="text-caption text-muted-foreground">{project.problem}</p>
      </div>
      <div>
        <p className="eyebrow mb-1">Outcome</p>
        <p className="text-caption text-foreground/85">{project.outcome}</p>
      </div>
    </div>

    {project.achievements && project.achievements.length > 0 && (
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 p-3">
        <Trophy className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
        <p className="text-caption text-foreground/85">{project.achievements[0]}</p>
      </div>
    )}

    <div className="mb-5 flex flex-wrap gap-1.5">
      {project.techStack.slice(0, 6).map((tech) => (
        <TechBadge key={tech}>{tech}</TechBadge>
      ))}
      {project.techStack.length > 6 && (
        <span className="chip text-muted-foreground/70">+{project.techStack.length - 6}</span>
      )}
    </div>

    <div className="mt-auto flex items-center gap-1 border-t border-border/60 pt-5">
      {LINK_KINDS.map(({ key, icon: Icon, label }) => {
        const href = project[key as keyof Project] as string | undefined;
        if (!href) return null;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            aria-label={`${project.title} — ${label}`}
            className="press rounded-full p-2 text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  </article>
);

/* ───────────────────── Featured carousel (touch) ───────────────────── */

const GAP = 16;
const CARD_RATIO = 0.86;

/**
 * A flick throws the track: the release velocity projects a resting point, and
 * the card nearest that projection wins — not the card nearest where the finger
 * happened to stop. The same velocity is handed to the spring, so there's no
 * seam between dragging and settling.
 */
const FeaturedCarousel = ({ items }: { items: Project[] }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [active, setActive] = useState(0);
  const x = useMotionValue(0);
  const t = useTransitions();

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const measure = () => {
      const width = element.clientWidth;
      const cardStep = width * CARD_RATIO + GAP;
      setStep(cardStep);
      setMaxOffset(Math.max(0, cardStep * items.length - GAP - width));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);

  const snapPoints = useMemo(
    () => items.map((_, index) => -Math.min(index * step, maxOffset)),
    [items, step, maxOffset],
  );

  const goTo = (index: number, velocity = 0) => {
    setActive(index);
    animate(x, snapPoints[index], { ...spring.momentum, velocity });
  };

  return (
    <div className="md:hidden">
      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          className="drag-x flex items-stretch"
          style={{ x, gap: GAP }}
          drag={t.reduced ? false : 'x'}
          dragConstraints={{ left: -maxOffset, right: 0 }}
          /* 0.55 is the same resistance constant used for sheet boundaries */
          dragElastic={0.55}
          onDragEnd={(_, info) => {
            const projected = x.get() + projectMomentum(info.velocity.x);
            const target = nearestSnap(projected, snapPoints);
            const index = snapPoints.indexOf(target);
            goTo(index === -1 ? active : index, info.velocity.x);
          }}
        >
          {items.map((item) => (
            <div key={item.title} className="shrink-0" style={{ width: `${CARD_RATIO * 100}%` }}>
              <FeaturedCard project={item} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.title}
            onClick={() => goTo(index)}
            aria-label={`Show ${item.title}`}
            aria-current={active === index}
            className="press p-1.5"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-200 ${
                active === index ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/25'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── Registry row ───────────────────────── */

const RegistryRow = ({ project }: { project: Project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTransitions();

  const hasLinks = LINK_KINDS.some(({ key }) => project[key as keyof Project]);

  return (
    <div className="border-t border-border/60 first:border-t-0">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={`press group/row flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-foreground/[0.03] md:px-6 ${
          isOpen ? 'bg-foreground/[0.03]' : ''
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 flex-grow items-center gap-3">
          <h4 className="truncate text-body-sm font-medium text-foreground group-hover/row:text-primary">
            {project.title}
          </h4>
          <span className="hidden shrink-0 text-caption text-muted-foreground md:inline">
            {project.category}
          </span>
        </div>

        <div className="hidden max-w-[300px] shrink-0 items-center gap-1.5 overflow-hidden lg:flex">
          {project.techStack.slice(0, 2).map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
          {project.techStack.length > 2 && (
            <span className="text-caption text-muted-foreground/60">
              +{project.techStack.length - 2}
            </span>
          )}
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={t.snappy}
          className="shrink-0 text-muted-foreground/70 group-hover/row:text-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={t.standard}
            className="overflow-hidden"
          >
            <div className="grid gap-8 px-5 pb-8 pt-1 md:grid-cols-[2fr_1fr] md:px-6">
              <div className="space-y-5">
                <p className="text-body-sm text-foreground/85">{project.description}</p>

                <div className="space-y-3 border-l border-border pl-4">
                  <div>
                    <p className="eyebrow mb-1">Problem</p>
                    <p className="text-caption text-muted-foreground">{project.problem}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1">Approach</p>
                    <p className="text-caption text-muted-foreground">{project.approach}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1">Outcome</p>
                    <p className="text-caption text-foreground/85">{project.outcome}</p>
                  </div>
                </div>

                {project.achievements && project.achievements.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3">Achievements</p>
                    <ul className="space-y-1.5">
                      {project.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-caption text-muted-foreground"
                        >
                          <span className="mt-[0.6em] block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/60" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.additionalDetails && (
                  <div>
                    <p className="eyebrow mb-2">Details</p>
                    <p className="text-caption text-muted-foreground">
                      {project.additionalDetails}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="eyebrow mb-3">Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <TechBadge key={tech}>{tech}</TechBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow mb-3">Links</p>
                  <div className="space-y-1.5">
                    {LINK_KINDS.map(({ key, icon: Icon, label }) => {
                      const href = project[key as keyof Project] as string | undefined;
                      if (!href) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="press group/link flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-caption text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                          </span>
                          <ArrowUpRight className="h-3 w-3 opacity-50 transition-all duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                        </a>
                      );
                    })}
                    {!hasLinks && (
                      <p className="text-caption text-muted-foreground/60">No external links</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ───────────────────────── Section ───────────────────────── */

export const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const isMobile = useIsMobile();

  const { featured, rest } = useMemo(() => {
    const featuredSet = new Set(FEATURED_TITLES);
    const featuredProjects = FEATURED_TITLES.map((title) =>
      projects.find((p) => p.title === title),
    ).filter((p): p is Project => Boolean(p));
    const restProjects = projects.filter((p) => !featuredSet.has(p.title));
    return { featured: featuredProjects, rest: restProjects };
  }, []);

  const categories = ['All', ...Array.from(new Set(rest.map((p) => p.category)))];
  const filteredRest =
    activeCategory === 'All' ? rest : rest.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Selected Work"
            title="Projects"
            description="A mix of security labs, cloud infrastructure, automation tools, and fullstack apps I've built—from hackathon winners to hands-on AWS experiments. Each one taught me something new (and sometimes broke in interesting ways)."
          />
        </AnimatedSection>

        {featured.length > 0 && (
          <div className="mt-14">
            {/* Swipe on touch, grid on pointer — same cards either way */}
            {isMobile ? (
              <FeaturedCarousel items={featured} />
            ) : (
              <StaggerContainer className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((item) => (
                  <StaggerItem key={item.title} className="h-full">
                    <FeaturedCard project={item} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        )}

        <div className="mt-16">
          <AnimatedSection>
            <p className="eyebrow mb-4">Everything else</p>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <div className="mb-5 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`press relative rounded-full px-3.5 py-1.5 text-caption font-medium ${
                    activeCategory === category
                      ? 'text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {activeCategory === category && (
                    <motion.span
                      layoutId="registry-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={spring.snappy}
                    />
                  )}
                  <span className="relative">{category}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {filteredRest.length === 0 ? (
                <p className="px-6 py-12 text-center text-body-sm text-muted-foreground">
                  Nothing matches that filter.
                </p>
              ) : (
                filteredRest.map((item, i) => (
                  <RegistryRow key={`${item.title}-${i}`} project={item} />
                ))
              )}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.15} className="mt-14 text-center">
          <Button variant="hero-outline" size="lg" asChild className="group">
            <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">
              <Github />
              See more on GitHub
              <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
