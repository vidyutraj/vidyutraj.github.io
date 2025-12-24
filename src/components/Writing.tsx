import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { articles } from '@/data/writing';
import { personalInfo } from '@/data/personal';

export const Writing = () => {
  return (
    <section id="writing" className="relative py-32 md:py-40">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="tail -n 4 ./blog/posts.log"
            title="Writing"
            description="Breaking down complex tech topics into digestible pieces."
          />
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-16" staggerDelay={0.1}>
          {articles.map((article) => (
            <StaggerItem key={article.title}>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full p-7 rounded-xl bg-card border border-border/50 card-hover group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <a 
            href={personalInfo.social.medium} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm hover:gap-3"
          >
            Read more on Medium
            <ArrowRight className="w-4 h-4" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};
