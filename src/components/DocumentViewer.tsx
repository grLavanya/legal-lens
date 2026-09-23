import { useEffect, useRef } from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import type { ParsedDocument, SourceLocator, ThemeMode, MoodCategory } from '@/types';
import { getMood, SHELL } from '@/moods';

interface DocumentViewerProps {
  document: ParsedDocument;
  mode: ThemeMode;
  category: MoodCategory;
  highlight: SourceLocator | null;
  onClose: () => void;
}

export function DocumentViewer({ document, mode, category, highlight, onClose }: DocumentViewerProps) {
  const mood = getMood(category, mode);
  const muted = SHELL.warmGrey;
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlight]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        style={{ background: mode === 'dark' ? '#1C1C20' : '#FFFFFF' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: mode === 'dark' ? '#2A2A2E' : '#E0DDD8' }}>
          <div className="flex items-center gap-2.5">
            <FileText size={18} color={mood.accent} />
            <span className="font-semibold text-sm">{document.title}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-black/10" style={{ color: muted }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {document.fullText.map((chunk) => {
            const isHighlighted = highlight?.page === chunk.page && highlight?.clause_ref === chunk.clause_ref;
            return (
              <div
                key={`${chunk.page}-${chunk.clause_ref}`}
                ref={isHighlighted ? highlightRef : undefined}
                className="rounded-lg p-4 transition-all duration-500"
                style={{
                  background: isHighlighted
                    ? `${mood.accent}12`
                    : (mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'),
                  border: isHighlighted ? `1px solid ${mood.accent}50` : '1px solid transparent',
                  boxShadow: isHighlighted ? `0 0 12px ${mood.accent}30` : 'none',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${mood.accent}15`, color: mood.accent }}
                  >
                    p.{chunk.page} § {chunk.clause_ref}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: mode === 'dark' ? '#D0D0D4' : '#3A3A3A' }}>
                  {chunk.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: mode === 'dark' ? '#2A2A2E' : '#E0DDD8' }}>
          <span className="text-xs" style={{ color: muted }}>
            {highlight ? `Clause ${highlight.clause_ref} · Page ${highlight.page}` : 'Document source view'}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: muted }}>
            <ArrowRight size={12} /> Click any clause to jump here
          </span>
        </div>
      </div>
    </div>
  );
}
