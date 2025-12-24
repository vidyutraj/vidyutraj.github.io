import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { personalInfo } from '@/data/personal';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { certifications } from '@/data/certifications';
import { leadership } from '@/data/leadership';
import { articles } from '@/data/writing';

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

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I can answer questions about ${personalInfo.name}'s portfolio based on the documented projects, experience, and work. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey || apiKey === 'your_groq_api_key_here') {
        throw new Error('API key not configured');
      }

      // Using Groq API (free tier, very fast)
      // Note: In production, you should proxy this through your backend to hide API keys
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Fast, free model
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          temperature: 0.3, // Lower temperature for more grounded, factual responses
          max_tokens: 400, // Slightly reduced to encourage concise, evidence-based answers
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'Sorry, I encountered an error processing your request.';
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      let errorContent = 'Sorry, I\'m having trouble connecting right now. Please try again later or reach out directly via email!';
      
      if (!apiKey || apiKey === 'your_groq_api_key_here') {
        errorContent = 'Chatbot API key not configured. Please set VITE_GROQ_API_KEY in your .env file. For now, feel free to reach out via email!';
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-10 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Portfolio Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me anything about {personalInfo.name.split(' ')[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-mono">online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-background/50 rounded-lg border border-border/30"
        style={{ maxHeight: '400px', minHeight: '300px' }}
      >
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-terminal-green/20 text-terminal-green'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary/20 text-foreground'
                  : 'bg-secondary/50 text-muted-foreground'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.role === 'assistant' ? (
                    message.content.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={idx} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={idx}>{part}</span>;
                    })
                  ) : (
                    message.content
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-terminal-green/20 text-terminal-green">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-secondary/50">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, experience, skills..."
          className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono text-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={!input.trim() || isLoading}
          className="px-4"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-xs text-muted-foreground font-mono mt-2 text-center">
        Powered by Groq AI • Ask about projects, experience, or skills
      </div>
    </div>
  );
};

