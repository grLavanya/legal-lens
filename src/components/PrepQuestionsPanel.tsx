import { useState } from 'react';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import type { ParsedDocument, ThemeMode, SourceLocator, MoodCategory, PrepQuestion } from '@/types';
import { getMood, SHELL } from '@/moods';
import { AudienceSelector } from '@/components/AudienceSelector';

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
  const [questions, setQuestions] = useState<PrepQuestion[]>([]);
  const mood = getMood(category, mode);
  const muted = SHELL.warmGrey;

  const generateQuestions = () => {
    setLoading(true);
    setTimeout(() => {
      const role = selectedRole ?? 'general';
      const baseQuestions: PrepQuestion[] = document.clauses
        .filter((c) => role === 'general' || c.relevant_to.includes(role))
        .slice(0, 5)
        .map((c) => ({
          id: `q-${c.id}`,
          question: `Can you explain the implications of ${c.title.toLowerCase()} (${c.clause_ref}) and whether this is standard or negotiable?`,
          context: c.description,
          source: c.source,
        }));

      if (baseQuestions.length === 0) {
        setQuestions([
          {
            id: 'q-general-1',
            question: 'What are the most important clauses I should focus on in this document?',
            context: 'A general overview of the document\'s key terms.',
          },
          {
            id: 'q-general-2',
            question: 'Are there any clauses that are unusual or non-standard compared to typical agreements of this type?',
            context: 'Ask about industry norms and benchmark comparisons.',
          },
        ]);
      } else {
        setQuestions(baseQuestions);
      }
      setGenerated(true);
      setLoading(false);
    }, 1200);
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
