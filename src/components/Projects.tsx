import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { SectionHeader, TechBadge } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, FolderGit2, ChevronDown, ChevronUp, Trophy, Video, FileText } from 'lucide-react';
import { projects, projectCategories } from '@/data/projects';
import { personalInfo } from '@/data/personal';
import { useState } from 'react';

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExpandableContent = project.achievements || project.additionalDetails || project.slidesUrl || project.videoUrl;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  return (
    <StaggerItem>
      <div className="flex flex-col p-7 rounded-xl bg-card border border-border/50 card-hover group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <FolderGit2 className="w-5 h-5 text-primary group-hover:animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-secondary/70 transition-all text-muted-foreground hover:text-primary hover:scale-125 hover:rotate-12"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-secondary/70 transition-all text-muted-foreground hover:text-primary hover:scale-125 hover:-rotate-12"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.videoUrl && (
              <a 
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-secondary/70 transition-all text-muted-foreground hover:text-primary hover:scale-125 hover:rotate-12"
                title="Demo Video"
              >
                <Video className="w-4 h-4" />
              </a>
            )}
            {project.slidesUrl && (
              <a 
                href={project.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-secondary/70 transition-all text-muted-foreground hover:text-primary hover:scale-125 hover:-rotate-12"
                title="Presentation"
              >
                <FileText className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>


        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 flex-grow leading-relaxed">
          {project.description}
        </p>

        {/* Problem → Outcome */}
                <div className="space-y-3 mb-5 text-xs text-muted-foreground bg-secondary/30 p-4 rounded-lg border border-border/30">
                  <div>
                    <span className="text-terminal-green font-mono font-semibold">Problem:</span>{' '}
                    <span>{project.problem}</span>
                  </div>
                  <div>
                    <span className="text-terminal-amber font-mono font-semibold">Outcome:</span>{' '}
                    <span>{project.outcome}</span>
                  </div>
                </div>

        {/* Expanded Content */}
        {hasExpandableContent && isExpanded && (
          <div className="space-y-4 mb-5 pt-4 border-t border-border/30">
            {/* Achievements */}
            {project.achievements && project.achievements.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Achievements</span>
                </div>
                <ul className="space-y-2">
                  {project.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Details */}
            {project.additionalDetails && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.additionalDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-auto pt-5 border-t border-border/50">
          {project.techStack.map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {hasExpandableContent && (
          <button
            onClick={handleToggle}
            className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 mt-4 pt-4 border-t border-border/30 -mx-7 px-7"
          >
            <span>{isExpanded ? 'Show less' : 'View more details'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            )}
          </button>
        )}
      </div>
    </StaggerItem>
  );
};

export const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Get unique categories from projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects based on active category
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-32 md:py-40">
      <div className="container px-6 md:px-8 max-w-7xl">
        <AnimatedSection>
          <SectionHeader 
            command="ls -la ./projects"
            title="Projects"
            description="A mix of security labs, cloud infrastructure, automation tools, and fullstack apps I've built—from hackathon winners to hands-on AWS experiments. Each one taught me something new (and sometimes broke in interesting ways)."
          />
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection delay={0.1} className="mt-12">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start border-b border-border/50 pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary/20 text-primary border-b-2 border-primary scale-105 shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Projects grid */}
        <AnimatedSection delay={0.2} className="mt-8">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start" staggerDelay={0.1}>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={`${project.title}-${index}`} project={project} />
            ))}
          </StaggerContainer>
        </AnimatedSection>

        {/* View all link */}
        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <Button variant="outline" size="lg" asChild>
            <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
              See More on GitHub
            </a>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
