import { useState } from 'react';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import type { ParsedDocument, ThemeMode, SourceLocator, MoodCategory, PrepQuestion } from '@/types';
import { getMood, SHELL } from '@/moods';
import { AudienceSelector } from '@/components/AudienceSelector';
import { generatePrepQuestions } from '@/lib/generatePrepQuestions';

interface PrepQuestionsPanelProps {
  document: ParsedDocument;
  mode: ThemeMode;
  category: MoodCategory;
  onViewSource: (source: SourceLocator) => void;
}

export function PrepQuestionsPanel({ document, mode, category, onViewSource }: PrepQuestionsPanelProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PrepQuestion[]>([]);
  const mood = getMood(category, mode);
  const muted = SHELL.warmGrey;

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePrepQuestions(document, selectedRole);
      setQuestions(result);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mt-4 p-5 rounded-xl"
      style={{
        background: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        border: `1px solid ${mood.sheetBorder}`,
      }}
    >
      {!generated ? (
        <div>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: mood.text, opacity: 0.85 }}>
            Generate a list of questions to bring to a legal professional. We'll tailor them to your role
            and the specific clauses in this document.
          </p>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: muted }}>
              <Users size={13} /> I am a...
            </span>
            <AudienceSelector
              category={category}
              mode={mode}
              roles={document.detected_roles}
              selected={selectedRole}
              onChange={setSelectedRole}
            />
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: mood.accent, color: mode === 'dark' ? '#1A1410' : '#FFFFFF' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: mode === 'dark' ? '#1A1410' : '#fff', borderRightColor: mode === 'dark' ? '#1A1410' : '#fff' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate questions
              </>
            )}
          </button>

          {error && (
            <p className="text-xs mt-3" style={{ color: '#DC2626' }}>{error}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold" style={{ color: mood.text }}>
              Questions for your legal professional
            </h4>
            <button
              onClick={() => { setGenerated(false); setQuestions([]); }}
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: muted }}
            >
              Start over
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="p-3.5 rounded-lg"
                style={{
                  background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${mood.sheetBorder}`,
                }}
              >
                <div className="flex gap-3">
                  <span
                    className="text-xs font-mono shrink-0 mt-0.5"
                    style={{ color: mood.accent }}
                  >
                    Q{i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1.5" style={{ color: mood.text }}>
                      {q.question}
                    </p>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: mood.textMuted }}>
                      {q.context}
                    </p>
                    {q.source && (
                      <button
                        onClick={() => onViewSource(q.source!)}
                        className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
                        style={{ color: mood.accent }}
                      >
                        View in document <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}