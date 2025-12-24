import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, BookOpen } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const Contact = () => {
  return (
    <section id="contact" className="relative py-32 md:py-40 bg-card/20">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="echo $CONTACT_INFO"
            title="Get in Touch"
            description="Let's chat! Whether it's about a project, an interesting security challenge, or just to geek out about cloud infrastructure—I'm always up for a conversation."
          />
        </AnimatedSection>

        <div className="max-w-3xl mt-16">
          {/* Email CTA */}
          <AnimatedSection delay={0.1}>
            <div className="w-full flex flex-col justify-start p-10 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Let's Connect
                </h3>
                <p className="text-muted-foreground">
                  Open to discussing opportunities, collaborations, or interesting security challenges. 
                  Always happy to connect and chat! (Bonus points if you mention something cool you're working on)
                  <br /><br />
                  You can also ask me questions using the chatbot icon in the bottom right corner.
                </p>
              </div>
              <Button variant="hero" size="lg" className="w-full sm:w-auto mt-auto" asChild>
                <a href={`mailto:${personalInfo.social.email}`}>
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: personalInfo.social.github,
      icon: Github,
    },
    {
      name: 'LinkedIn',
      url: personalInfo.social.linkedin,
      icon: Linkedin,
    },
    {
      name: 'Medium',
      url: personalInfo.social.medium,
      icon: BookOpen,
    },
  ];

  return (
    <footer className="border-t border-border/50 py-12 bg-background/50">
      <div className="container px-6 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
