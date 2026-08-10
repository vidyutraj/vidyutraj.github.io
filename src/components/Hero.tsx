import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, ChevronDown, BookOpen, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { personalInfo } from '@/data/personal';
import { useTransitions } from '@/lib/motion';

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const t = useTransitions();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // A single, shallow depth cue. Large surfaces fade as they leave rather than
  // sliding a full-viewport background around behind the text.
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Critically damped cursor tracking — the portrait leans, it doesn't wobble.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30, mass: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!portraitRef.current || t.reduced) return;
    const rect = portraitRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 26);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 26);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-32"
    >
      <motion.div
        style={{ y: t.reduced ? 0 : contentY, opacity: contentOpacity }}
        className="container relative z-10 max-w-6xl px-6 md:px-10"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Text column */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: t.reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t.standard}
              className="mb-7 flex items-center gap-2.5"
            >
              <span className="status-live" />
              <span className="eyebrow text-foreground/70">
                Available &nbsp;·&nbsp; {personalInfo.location}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: t.reduced ? 0 : 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t.gentle, delay: 0.05 }}
              className="gradient-text mb-6 text-display-xl font-semibold"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: t.reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t.gentle, delay: 0.12 }}
              className="mb-8 text-body-lg text-foreground/70"
            >
              {personalInfo.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: t.reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t.gentle, delay: 0.18 }}
              className="mb-11 max-w-xl text-body text-muted-foreground"
            >
              Building systems, securing infrastructure, and exploring where technology meets
              impact. When I'm not debugging infrastructure or writing about the latest AWS
              outage, you'll find me diving deep into hands-on labs and turning complex problems
              into elegant solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: t.reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t.gentle, delay: 0.24 }}
              className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button variant="hero" size="lg" asChild className="group">
                <a href="#projects">
                  See what I built
                  <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <a href="#contact">Get in touch</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...t.gentle, delay: 0.32 }}
              className="flex items-center gap-7"
            >
              {[
                { icon: Github, label: 'GitHub', url: personalInfo.social.github },
                { icon: Linkedin, label: 'LinkedIn', url: personalInfo.social.linkedin },
                { icon: BookOpen, label: 'Medium', url: personalInfo.social.medium },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: t.reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...t.gentle, delay: 0.1 }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div
              ref={portraitRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
              className="relative"
            >
              <motion.div
                style={{ x: springX, y: springY }}
                className="relative h-[340px] w-[268px] overflow-hidden rounded-2xl border border-white/[0.08] shadow-e4 md:h-[420px] md:w-[330px] lg:h-[470px] lg:w-[364px]"
              >
                <img
                  src={`${import.meta.env.BASE_URL}logos/Portrait_Vidyut.jpg`}
                  alt="Vidyut Rajagopal"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />
                {/* Grounds the image in the page rather than floating on it */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Wayfinding: says there is more below, without animating forever */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...t.gentle, delay: 0.5 }}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2"
      >
        <a
          href="#about"
          className="press group flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <span className="eyebrow">Scroll</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
        </a>
      </motion.div>
    </section>
  );
};
