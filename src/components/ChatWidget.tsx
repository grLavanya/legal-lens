import { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, ArrowRight, Sparkles } from 'lucide-react';
import type { ParsedDocument, ThemeMode, SourceLocator, ChatMessage, MoodCategory } from '@/types';
import { getMood, SHELL } from '@/moods';
import { askQuestion } from '@/lib/askQuestion';

interface ChatWidgetProps {
  document: ParsedDocument;
  mode: ThemeMode;
  category: MoodCategory;
  onViewSource: (source: SourceLocator) => void;
}

export function ChatWidget({ document, mode, category, onViewSource }: ChatWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mood = getMood(category, mode);
  const muted = SHELL.warmGrey;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      grounded: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const { answer, source } = await askQuestion(document, userMsg.content);
      const isGrounded = source !== null && !answer.toLowerCase().includes("isn't covered in the document");

      const response: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer,
        source: source ?? undefined,
        grounded: isGrounded,
      };
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: "Something went wrong answering that. Please try again.",
          grounded: false,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const suggestions = [
    'What is the most important clause?',
    'What are my obligations?',
    'Summarize this document',
  ];

  return (
    <>
      {/* Collapsed state */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl transition-all hover:scale-105"
          style={{
            background: SHELL.indigo,
            color: '#fff',
          }}
        >
          <MessageSquareText size={20} />
          <span className="text-sm font-semibold">Ask a question about this document</span>
        </button>
      )}

      {/* Expanded state */}
      {expanded && (
        <div
          className="fixed bottom-5 right-5 z-40 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            background: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
            border: `1px solid ${mode === 'dark' ? '#2A2A2E' : '#E0DDD8'}`,
            height: 'min(560px, calc(100vh - 3rem))',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: SHELL.indigo, color: '#fff' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Ask about this document</span>
            </div>
            <button onClick={() => setExpanded(false)} className="p-1 rounded-lg transition-colors hover:bg-white/20">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm mb-4" style={{ color: muted }}>
                  Ask anything about "{document.title}". I'll answer based only on the document content.
                </p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); }}
                      className="text-xs text-left px-3 py-2 rounded-lg transition-colors hover:bg-black/5"
                      style={{
                        background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        color: mode === 'dark' ? '#D0D0D4' : '#3A3A3A',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex flex-col"
                style={{ alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user'
                      ? SHELL.indigo
                      : (mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    color: msg.role === 'user' ? '#fff' : (mode === 'dark' ? '#E0E0E4' : '#2A2A2A'),
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  }}
                >
                  {msg.content}
                  {msg.grounded && msg.source && (
                    <button
                      onClick={() => onViewSource(msg.source!)}
                      className="flex items-center gap-1 mt-2 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: msg.role === 'user' ? '#fff' : mood.accent }}
                    >
                      View in document <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-1.5 px-3 py-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: muted,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 border-t flex items-center gap-2"
            style={{ borderColor: mode === 'dark' ? '#2A2A2E' : '#E0DDD8' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your question..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: mode === 'dark' ? '#E0E0E4' : '#2A2A2A' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg transition-all disabled:opacity-40"
              style={{ background: SHELL.indigo, color: '#fff' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}