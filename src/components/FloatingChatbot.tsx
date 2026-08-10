import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, Bot, User, Loader2, X, Minimize2 } from 'lucide-react';
import {
  animate,
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { personalInfo } from '@/data/personal';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { certifications } from '@/data/certifications';
import { leadership } from '@/data/leadership';
import { articles } from '@/data/writing';
import { CHATBOT_BACKEND_URL } from '@/config/chatbot';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSheet } from '@/hooks/use-sheet';
import { nearestSnap, project, spring, useTransitions } from '@/lib/motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Build knowledge base from portfolio data
const buildKnowledgeBase = (): string => {
  const projectsText = projects.map(p =>
    `Project: ${p.title}\nCategory: ${p.category}\nDescription: ${p.description}\nProblem: ${p.problem}\nOutcome: ${p.outcome}\nTech Stack: ${p.techStack.join(', ')}\n${p.githubUrl ? `GitHub: ${p.githubUrl}` : ''}\n${p.demoUrl ? `Demo: ${p.demoUrl}` : ''}`
  ).join('\n\n');

  const experienceText = experiences.map(exp =>
    `Company: ${exp.company}\n${exp.roles.map(r =>
      `Role: ${r.position} (${r.startDate} - ${r.endDate || 'Present'})\n` +
      `Type: ${r.employmentType}\n` +
      `Location: ${r.location}\n` +
      (r.defaultBullets?.length ? `Responsibilities: ${r.defaultBullets.join('; ')}\n` : '') +
      (r.technologies?.length ? `Technologies: ${r.technologies.join(', ')}\n` : '') +
      (r.achievements?.length ? `Achievements: ${r.achievements.join('; ')}` : '')
    ).join('\n')}`
  ).join('\n\n');

  const certsText = certifications.map(c =>
    `${c.name} by ${c.issuer} (Issued: ${c.issueDate}${c.expirationDate ? `, Expires: ${c.expirationDate}` : ''})`
  ).join('\n');

  const leadershipText = leadership.map(l =>
    `${l.position} at ${l.organization} (${l.startDate} - ${l.endDate || 'Present'})`
  ).join('\n');

  const writingText = articles.map(a =>
    `Article: ${a.title}\nPublished: ${a.date}\nRead Time: ${a.readTime}\nDescription: ${a.description}\nTags: ${a.tags.join(', ')}\nURL: ${a.url}`
  ).join('\n\n');

  // Education information (hardcoded in About component)
  const educationText = `Georgia Institute of Technology
Degree: B.S. in Computer Engineering
Threads: Cybersecurity and Information Internetworks
Expected Graduation: May 2027
Location: Atlanta, GA
GPA: 4.0

Relevant Coursework:
${[
  'Data Structures & Algorithms',
  'Objects & Design',
  'Object-Oriented Programming',
  'Computer Systems Programming',
  'Computer Networking',
  'Computer Architecture',
  'FPGA Design',
  'Linear Algebra',
].join(', ')}`;

  return `
PORTFOLIO KNOWLEDGE BASE:

PERSONAL INFORMATION:
Name: ${personalInfo.name}
Title: ${personalInfo.title}
Location: ${personalInfo.location}
Tagline: ${personalInfo.tagline}

BIO:
${personalInfo.bio.intro}

Current Focus: ${personalInfo.bio.currentFocus.join(', ')}

Interests: ${personalInfo.bio.interests}

EDUCATION:
${educationText}

CONTACT:
Email: ${personalInfo.social.email}
GitHub: ${personalInfo.social.github}
LinkedIn: ${personalInfo.social.linkedin}
Medium: ${personalInfo.social.medium}

PROJECTS:
${projectsText}

EXPERIENCE:
${experienceText}

CERTIFICATIONS:
${certsText}

LEADERSHIP:
${leadershipText}

WRITING/ARTICLES:
${writingText}
`.trim();
};

const SYSTEM_PROMPT = `You are a technical assistant representing ${personalInfo.name}. Answer questions using ONLY explicitly documented information from the knowledge base.

CRITICAL RULES - NO INFERENCES OR IMPLICATIONS:
1. ONLY state facts that are explicitly written in the knowledge base. Do NOT infer, imply, or assume anything.
2. Do NOT use phrases like: "likely," "probably," "implied," "suggests," "may have," "would have," "typically," "usually." These are inferences, not facts.
3. Role titles alone do NOT imply activities. For example, "Researcher" does NOT mean "presented findings" or "co-authored papers" unless explicitly stated.
4. Do NOT infer accomplishments, presentations, publications, or contributions from role titles or descriptions. Only mention what is explicitly documented.
5. For questions that can be answered by synthesizing explicit information (e.g., "what skills?" when projects list tech stacks), compile ONLY what is explicitly listed.
6. If the knowledge base does not contain enough explicit information to answer a question, say: "I don't have enough information to answer that accurately from the available portfolio data."
7. Avoid resume buzzwords and hype language. Do NOT use: "extensive," "expert," "highly accomplished," "deep expertise," "years of experience," "proven track record."
8. Use concrete, action-oriented language for explicitly documented activities: "built," "configured," "developed," "implemented," "worked on."
9. When listing technologies, projects, or experiences, only include what is explicitly mentioned. Do not extrapolate.
10. For dates, roles, and certifications, use the exact information provided. Never assume duration, scope, or activities beyond what is stated.
11. Keep responses technical, precise, and conversational. Write for a technically literate audience.
12. Use **bold** (with double asterisks) to highlight important information like project names, key technologies, achievements, or metrics. Use bold sparingly.
13. Example of what NOT to do: "As a Researcher, Vidyut likely presented findings" → This is inference.
14. Example of what TO do: "Vidyut worked as an Embedded System Security Researcher starting in 2026-02" → This is a documented fact.

Tone: Technical peer stating only documented facts, never inferring or implying unstated activities.

Knowledge Base:
${buildKnowledgeBase()}`;

/** Past this projected offset — or this release speed — the sheet is dismissed. */
const DISMISS_FRACTION = 0.66;
const DISMISS_VELOCITY = 900;

const renderContent = (content: string) =>
  content.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );

export const FloatingChatbot = () => {
  const isMobile = useIsMobile();
  const t = useTransitions();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I can answer questions about ${personalInfo.name.split(' ')[0]}'s portfolio based on documented projects, experience, and work. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const sheetRef = useSheet(isOpen && isMobile, close, { lockScroll: isMobile });

  /* ── Sheet physics (mobile) ─────────────────────────────────────── */
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const releaseVelocity = useRef(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const scrimOpacity = useTransform(y, [0, Math.max(sheetHeight, 1)], [1, 0]);

  const detents = useMemo(() => [0, sheetHeight * 0.45], [sheetHeight]);

  useEffect(() => {
    if (!isOpen || !isMobile) return;
    y.set(0);
    const measure = () => setSheetHeight(sheetRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isOpen, isMobile, y, sheetRef]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: t.reduced ? 'auto' : 'smooth',
      });
    });
  }, [t.reduced]);

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
  }, [messages, isOpen, isMinimized, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(id);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      // Calls the Cloudflare Worker, which holds the API key server-side
      const response = await fetch(CHATBOT_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      const content =
        data.choices?.[0]?.message?.content ||
        data.content ||
        'Sorry, I encountered an error processing your request.';

      setMessages((prev) => [...prev, { role: 'assistant', content, timestamp: new Date() }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const isNetwork = error instanceof TypeError && error.message.includes('fetch');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isNetwork
            ? 'Unable to connect to the chatbot service. Please check your connection and try again, or reach out directly via email!'
            : "Sorry, I'm having trouble connecting to the chatbot service right now. Please try again later or reach out directly via email!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const conversation = (
    <>
      <div
        ref={messagesContainerRef}
        className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                message.role === 'user'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-foreground/10 text-foreground/80'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block rounded-2xl px-3.5 py-2.5 text-left text-body-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground/85'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.role === 'assistant' ? renderContent(message.content) : message.content}
                </p>
              </div>
              <p className="mt-1 px-1 text-caption text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground/80">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="inline-block rounded-2xl bg-secondary px-3.5 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.07] p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about projects, experience, skills…"
            aria-label="Message"
            className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2 text-body-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            disabled={isLoading}
          />
          <Button type="submit" variant="hero" size="icon" disabled={!input.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  );

  const header = (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h2 className="vibrant text-body-sm font-semibold">Portfolio assistant</h2>
          <p className="text-caption text-muted-foreground">
            Ask about {personalInfo.name.split(' ')[0]}'s work
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!isMobile && (
          <button
            onClick={() => setIsMinimized((value) => !value)}
            className="press rounded-full p-1.5 text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={close}
          className="press rounded-full p-1.5 text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"
          aria-label="Close assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: t.reduced ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: t.reduced ? 1 : 0.8 }}
            transition={t.snappy}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="press fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-e3"
            aria-label="Open portfolio assistant"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/*
              Modal on mobile: it blocks, so it dims. Outer layer owns the
              mount/unmount fade, inner layer tracks the drag live.
            */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={t.standard}
              className="fixed inset-0 z-40"
            >
              {/*
                A pointer shortcut, not a control: Escape and the header's close
                button already own dismissal, so announcing a second "close"
                target would just be noise.
              */}
              <motion.div
                onClick={close}
                aria-hidden="true"
                style={{ opacity: t.reduced ? 1 : scrimOpacity }}
                className="absolute inset-0 bg-background/70"
              />
            </motion.div>

            <motion.div
              key="sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio assistant"
              tabIndex={-1}
              initial={{ y: t.reduced ? 0 : '100%' }}
              animate={{ y: 0 }}
              exit={{
                y: t.reduced ? 0 : '100%',
                transition: t.reduced
                  ? t.standard
                  : { ...spring.gentle, velocity: releaseVelocity.current },
              }}
              transition={t.gentle}
              style={{ y }}
              drag={t.reduced ? false : 'y'}
              /* Only the handle starts a drag, so the transcript can still scroll */
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: sheetHeight || 600 }}
              dragElastic={{ top: 0.55, bottom: 0 }}
              onDragEnd={(_, info) => {
                const projected = y.get() + project(info.velocity.y);
                if (
                  projected > sheetHeight * DISMISS_FRACTION ||
                  info.velocity.y > DISMISS_VELOCITY
                ) {
                  releaseVelocity.current = info.velocity.y;
                  close();
                  return;
                }
                animate(y, nearestSnap(projected, detents), {
                  ...spring.gentle,
                  velocity: info.velocity.y,
                });
              }}
              className="material-sheet drag-y fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col rounded-t-2xl"
            >
              <div
                onPointerDown={(event) => dragControls.start(event)}
                className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
              >
                <div className="flex justify-center pb-1 pt-3" aria-hidden="true">
                  <span className="h-1 w-9 rounded-full bg-foreground/20" />
                </div>
                {header}
              </div>
              {conversation}
            </motion.div>
          </>
        )}

        {isOpen && !isMobile && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Portfolio assistant"
            /*
              Materialize rather than fade: blur and scale move together, so the
              panel reads as a real surface arriving. It grows from — and returns
              to — the corner its trigger sits in.
            */
            initial={{ opacity: 0, scale: t.reduced ? 1 : 0.9, filter: t.reduced ? 'none' : 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: t.reduced ? 1 : 0.9, filter: t.reduced ? 'none' : 'blur(14px)' }}
            transition={t.standard}
            style={{ transformOrigin: 'bottom right' }}
            className={`material-sheet fixed bottom-6 right-6 z-50 flex w-96 flex-col overflow-hidden rounded-2xl ${
              isMinimized ? 'h-auto' : 'h-[600px]'
            }`}
          >
            {header}
            {!isMinimized && conversation}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
