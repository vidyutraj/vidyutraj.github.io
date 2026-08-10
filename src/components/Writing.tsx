import { AnimatedSection } from '@/components/AnimatedSection';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/data/writing';
import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';
import { useTransitions } from '@/lib/motion';

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatMonth = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export const Writing = () => {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const [lead, ...rest] = sorted;

  return (
    <section id="writing" className="relative py-28 md:py-36">
      <div className="container max-w-6xl px-6 md:px-10">
        <AnimatedSection>
          <SectionHeader
            kicker="Essays"
            title="Writing"
            description="Breaking down complex tech topics into digestible pieces."
          />
        </AnimatedSection>

        {lead && (
          <AnimatedSection delay={0.06} className="mt-14">
            <a
              href={lead.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-interactive press-soft press group block rounded-2xl p-8 md:p-10"
            >
              <p className="eyebrow mb-5">
                Latest &nbsp;·&nbsp; {formatDate(lead.date)} &nbsp;·&nbsp; {lead.readTime}
              </p>

              <h3 className="mb-4 text-display-sm font-semibold text-foreground group-hover:text-primary">
                {lead.title}
              </h3>

              <p className="mb-6 max-w-2xl text-body text-muted-foreground">{lead.description}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                {lead.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1.5 text-caption font-medium text-muted-foreground group-hover:text-primary">
                  Read
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </AnimatedSection>
        )}

        {rest.length > 0 && (
          <div className="mt-12">
            <AnimatedSection>
              <p className="eyebrow mb-4">Earlier</p>
            </AnimatedSection>

            <div className="overflow-hidden rounded-2xl border border-border/70">
              {rest.map((article, i) => (
                <ArchiveRow key={article.title} article={article} index={i} />
              ))}
            </div>
          </div>
        )}

        <AnimatedSection delay={0.12} className="mt-12">
          <a
            href={personalInfo.social.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="press group inline-flex items-center gap-2 text-body-sm font-medium text-muted-foreground hover:text-primary"
          >
            Read more on Medium
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

const ArchiveRow = ({ article, index }: { article: (typeof articles)[0]; index: number }) => {
  const t = useTransitions();

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: t.reduced ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...t.standard, delay: index * 0.05 }}
      className="press group/row block border-t border-border/60 first:border-t-0 hover:bg-foreground/[0.03]"
    >
      <div className="flex items-center gap-4 px-5 py-4 md:px-6">
        <div className="min-w-0 flex-grow">
          <h4 className="truncate text-body-sm font-medium text-foreground group-hover/row:text-primary">
            {article.title}
          </h4>
          <p className="mt-1 text-caption text-muted-foreground">
            {formatMonth(article.date)} &nbsp;·&nbsp; {article.readTime}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          {article.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
      </div>
    </motion.a>
  );
};
