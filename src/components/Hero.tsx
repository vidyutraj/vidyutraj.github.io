import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GlowOrb } from '@/components/SectionHeader';
import { Github, Linkedin, ChevronDown, BookOpen } from 'lucide-react';
import { personalInfo, heroContent } from '@/data/personal';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Glow orbs */}
      <GlowOrb className="w-96 h-96 -top-48 -left-48" />
      <GlowOrb className="w-72 h-72 top-1/3 -right-36 opacity-10" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan" />
      </div>

      <div className="container relative z-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div>
              <AnimatedSection delay={0.1}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-accent font-mono text-sm">$</span>
                  <span className="text-muted-foreground font-mono text-sm">whoami</span>
                  <span className="w-2 h-4 bg-primary/80 animate-blink" />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight">
                  {personalInfo.name}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <p className="text-xl md:text-2xl text-primary font-mono mb-6">
                  {personalInfo.title}{' '}
                  <span className="text-muted-foreground">|</span>{' '}
                  <span className="text-accent">{personalInfo.tagline}</span>{' '}
                  <span className="text-muted-foreground">|</span>{' '}
                  <span className="text-foreground/80">{personalInfo.location}</span>
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
                  Building systems, securing infrastructure, and exploring where technology meets impact. 
                  When I'm not debugging infrastructure or writing about the latest AWS outage, you'll find me 
                  diving deep into hands-on labs and turning complex problems into elegant solutions.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Button variant="hero-outline" size="lg" asChild className="group/btn2">
                    <a href="#projects">
                      <span className="group-hover/btn2:animate-pulse">See What I Built</span>
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-6">
                  <a 
                    href="https://github.com/vidyutraj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group hover:scale-105"
                  >
                    <Github className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                    <span className="font-mono text-sm">GitHub</span>
                  </a>
                  <a 
                    href="https://linkedin.com/in/vidyut-rajagopal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group hover:scale-105"
                  >
                    <Linkedin className="w-5 h-5 group-hover:scale-125 group-hover:-rotate-12 transition-transform" />
                    <span className="font-mono text-sm">LinkedIn</span>
                  </a>
                  <a 
                    href={personalInfo.social.medium} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group hover:scale-105"
                  >
                    <BookOpen className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                    <span className="font-mono text-sm">Medium</span>
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Right side - Portrait */}
            <AnimatedSection delay={0.3} className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-110 opacity-50" />
                
                {/* Image container with border and shadow */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:rotate-3 hover:shadow-primary/40">
                  <img 
                    src="/logos/Portrait_Vidyut.jpg" 
                    alt="Vidyut Rajagopal"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  {/* Gradient overlay for better integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <AnimatedSection delay={0.8} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <a 
            href="#about" 
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="font-mono text-xs">keep scrolling ↓</span>
            <ChevronDown className="w-5 h-5 animate-float group-hover:animate-bounce" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};
