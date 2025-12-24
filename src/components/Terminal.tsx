import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Command, HelpCircle, X } from 'lucide-react';
import { personalInfo } from '@/data/personal';
import { projects } from '@/data/projects';

interface CommandHistory {
  command: string;
  output: string | React.ReactNode;
  timestamp: Date;
}

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'welcome',
      output: `Welcome to ${personalInfo.name}'s portfolio terminal! Type 'help' to see available commands.`,
      timestamp: new Date(),
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (cmd: string): string | React.ReactNode => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = trimmedCmd.split(' ');

    switch (parts[0]) {
      case 'help':
        return (
          <div className="space-y-2">
            <div className="text-terminal-green font-mono">Available commands:</div>
            <div className="space-y-1 ml-4 font-mono text-sm">
              <div><span className="text-primary">help</span> - Show this help message</div>
              <div><span className="text-primary">about</span> - Learn about me</div>
              <div><span className="text-primary">projects</span> - List my projects</div>
              <div><span className="text-primary">skills</span> - View my tech stack</div>
              <div><span className="text-primary">contact</span> - Get contact information</div>
              <div><span className="text-primary">clear</span> - Clear terminal</div>
              <div><span className="text-primary">whoami</span> - Display user info</div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-3">
            <div className="text-terminal-green font-mono">About {personalInfo.name}</div>
            <div className="text-sm space-y-2 ml-4">
              <p>{personalInfo.bio.intro}</p>
              <p>
                Currently diving deep into{' '}
                {personalInfo.bio.currentFocus.map((focus, idx) => (
                  <span key={focus}>
                    <span className="text-primary">{focus}</span>
                    {idx < personalInfo.bio.currentFocus.length - 1 && ', '}
                    {idx === personalInfo.bio.currentFocus.length - 2 && ' and '}
                  </span>
                ))}
                .
              </p>
              <p>{personalInfo.bio.interests}</p>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-3">
            <div className="text-terminal-green font-mono">Projects ({projects.length}):</div>
            <div className="space-y-2 ml-4 font-mono text-sm">
              {projects.map((project, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-terminal-amber">[{idx + 1}]</span>
                  <div>
                    <div className="text-primary">{project.title}</div>
                    <div className="text-muted-foreground text-xs ml-2">
                      {project.category} • {project.description.substring(0, 60)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        const allSkills = new Set<string>();
        projects.forEach(p => p.techStack.forEach(skill => allSkills.add(skill)));
        const skillsArray = Array.from(allSkills).sort();
        
        return (
          <div className="space-y-3">
            <div className="text-terminal-green font-mono">Tech Stack ({skillsArray.length} technologies):</div>
            <div className="flex flex-wrap gap-2 ml-4">
              {skillsArray.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-2">
            <div className="text-terminal-green font-mono">Contact Information:</div>
            <div className="space-y-1 ml-4 font-mono text-sm">
              <div>
                <span className="text-primary">Email:</span>{' '}
                <a href={`mailto:${personalInfo.social.email}`} className="text-terminal-green hover:underline">
                  {personalInfo.social.email}
                </a>
              </div>
              <div>
                <span className="text-primary">GitHub:</span>{' '}
                <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-terminal-green hover:underline">
                  {personalInfo.social.github}
                </a>
              </div>
              <div>
                <span className="text-primary">LinkedIn:</span>{' '}
                <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-terminal-green hover:underline">
                  {personalInfo.social.linkedin}
                </a>
              </div>
              <div>
                <span className="text-primary">Medium:</span>{' '}
                <a href={personalInfo.social.medium} target="_blank" rel="noopener noreferrer" className="text-terminal-green hover:underline">
                  {personalInfo.social.medium}
                </a>
              </div>
            </div>
          </div>
        );

      case 'whoami':
        return (
          <div className="space-y-2">
            <div className="text-terminal-green font-mono">User Information:</div>
            <div className="space-y-1 ml-4 font-mono text-sm">
              <div><span className="text-primary">Name:</span> {personalInfo.name}</div>
              <div><span className="text-primary">Title:</span> {personalInfo.title}</div>
              <div><span className="text-primary">Location:</span> {personalInfo.location}</div>
              <div><span className="text-primary">Tagline:</span> {personalInfo.tagline}</div>
            </div>
          </div>
        );

      case 'clear':
        setHistory([]);
        return null;

      case '':
        return '';

      default:
        return (
          <div className="text-terminal-amber font-mono">
            Command not found: <span className="text-foreground">{parts[0]}</span>
            <br />
            <span className="text-muted-foreground text-sm">Type 'help' to see available commands.</span>
          </div>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    const parts = trimmedInput.toLowerCase().split(' ');
    const output = executeCommand(trimmedInput);
    
    if (parts[0] !== 'clear') {
      setHistory(prev => [...prev, { command: trimmedInput, output, timestamp: new Date() }]);
    }
    
    setCommandHistory(prev => [...prev, trimmedInput]);
    setInput('');
    setCurrentIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = currentIndex === -1 ? commandHistory.length - 1 : Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex !== -1) {
        const newIndex = currentIndex + 1;
        if (newIndex >= commandHistory.length) {
          setCurrentIndex(-1);
          setInput('');
        } else {
          setCurrentIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-10 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm font-semibold text-foreground">portfolio-terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-terminal-amber/50"></div>
          <div className="w-3 h-3 rounded-full bg-terminal-green/50"></div>
          <div className="w-3 h-3 rounded-full bg-primary/50"></div>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto font-mono text-sm bg-background/50 rounded-lg p-4 mb-4 border border-border/30"
        style={{ maxHeight: '400px', minHeight: '300px' }}
      >
        {history.map((item, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent">[vidyut@portfolio]</span>
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">{item.command}</span>
            </div>
            {item.output && (
              <div className="ml-4 text-muted-foreground">{item.output}</div>
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-accent">[vidyut@portfolio]</span>
          <span className="text-muted-foreground">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
            placeholder="Type a command..."
            autoFocus
          />
          <span className="w-2 h-4 bg-primary/80 animate-blink"></span>
        </form>
      </div>

      {/* Terminal Footer */}
      <div className="text-xs text-muted-foreground font-mono flex items-center justify-between pt-2 border-t border-border/30">
        <span>Type 'help' for available commands</span>
        <span>{history.length} command{history.length !== 1 ? 's' : ''} executed</span>
      </div>
    </div>
  );
};

