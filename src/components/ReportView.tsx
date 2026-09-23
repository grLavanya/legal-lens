import { useState, useMemo } from 'react';
import { ArrowRight, AlertTriangle, AlertCircle, Info, ChevronDown, MessageSquareText, Moon, Sun, ArrowLeft, Scale } from 'lucide-react';
import type { ParsedDocument, ThemeMode, SourceLocator } from '@/types';
import { getMood, SHELL } from '@/moods';
import { Sheet } from '@/components/BackgroundLayer';
import { Motif } from '@/components/Motif';
import { ScanLineReveal } from '@/components/ScanLineReveal';
import { AudienceSelector } from '@/components/AudienceSelector';
import { PrepQuestionsPanel } from '@/components/PrepQuestionsPanel';
import { MOODS } from '@/moods';

interface ReportViewProps {
  document: ParsedDocument;
  mode: ThemeMode;
  onToggleMode: () => void;
  onBack: () => void;
  onViewSource: (source: SourceLocator) => void;
}

const riskOrder = { high: 0, medium: 1, low: 2 };

export function ReportView({ document, mode, onToggleMode, onBack, onViewSource }: ReportViewProps) {
  const [scanDone, setScanDone] = useState(false);
  const [audience, setAudience] = useState<string | null>(null);
  const [prepOpen, setPrepOpen] = useState(false);

  const mood = getMood(document.category, mode);
  const moodMeta = MOODS[document.category];
  const muted = SHELL.warmGrey;

  const filteredClauses = useMemo(() => {
    let clauses = [...document.clauses];
    if (audience) {
      clauses = clauses.filter((c) => c.relevant_to.includes(audience));
      clauses.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
    } else {
      clauses.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
    }
    return clauses;
  }, [document.clauses, audience]);

  const reportContent = (
    <Sheet category={document.category} mode={mode} className="overflow-hidden">
      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Headline */}
        <div data-scan-section>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2" style={{ color: mood.text }}>
            {document.title}
          </h1>

          {/* Subtitle with dot + category label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm" style={{ color: mood.textMuted }}>{document.subtitle}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: mood.accent }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: mood.accent, letterSpacing: '0.15em' }}
            >
              {moodMeta.label}
            </span>
          </div>
        </div>

        {/* Audience selector */}
        <div data-scan-section className="mt-5 mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium" style={{ color: mood.textMuted }}>I am a...</span>
          <AudienceSelector
            category={document.category}
            mode={mode}
            roles={document.detected_roles}
            selected={audience}
            onChange={setAudience}
          />
        </div>

        {/* Flagged content blocks */}
        <div className="space-y-5">
          {filteredClauses.map((clause, i) => {
            const barOpacity = i === 0 ? 1 : 0.55;
            const RiskIcon = clause.risk_level === 'high' ? AlertCircle : clause.risk_level === 'medium' ? AlertTriangle : Info;
            return (
              <div key={clause.id} data-scan-section className="relative pl-5">
                {/* Vertical accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                  style={{
                    background: mood.accent,
                    opacity: barOpacity,
                  }}
                />
                {/* Label */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: mood.textMuted }}
                  >
                    Extracted Flagged Content — Analysis {i + 1}
                  </span>
                  <RiskIcon size={12} style={{ color: mood.accent, opacity: barOpacity }} />
                </div>
                {/* Title */}
                <h3 className="text-base font-semibold mb-1" style={{ color: mood.text }}>
                  {clause.title}
                </h3>
                {/* Body */}
                <p className="text-sm leading-relaxed mb-2" style={{ color: mood.text, opacity: 0.85 }}>
                  {clause.description}
                </p>
                {/* Source locator + view in document */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${mood.accent}12`, color: mood.accent }}
                  >
                    § {clause.clause_ref} · p.{clause.source.page}
                  </span>
                  <button
                    onClick={() => onViewSource(clause.source)}
                    className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
                    style={{ color: mood.accent }}
                  >
                    View in document <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prep questions button */}
        <div data-scan-section className="mt-8 pt-6 border-t" style={{ borderColor: `${mood.sheetBorder}` }}>
          <button
            onClick={() => setPrepOpen(!prepOpen)}
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: mood.accent }}
          >
            <MessageSquareText size={16} />
            Prepare questions for a professional
            <ChevronDown
              size={15}
              style={{ transform: prepOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
            />
          </button>

          {prepOpen && (
            <PrepQuestionsPanel
              document={document}
              mode={mode}
              category={document.category}
              onViewSource={onViewSource}
            />
          )}
        </div>
      </div>
    </Sheet>
  );

  return (
    <div className="relative min-h-screen">
      {/* Fixed mood background layer — covers full viewport, stays during scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: mood.bgGradient, transition: 'background 0.8s ease' }}
      >
        {document.category !== 'general' && (
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: '-80px',
              left: '-80px',
              width: '500px',
              height: '500px',
              opacity: mode === 'dark' ? 0.12 : 0.14,
            }}
          >
            <Motif category={document.category} color={mood.accent} className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Content layer — above background */}
      <div className="relative z-10">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: muted }}
          >
            <ArrowLeft size={16} />
            New document
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: SHELL.indigo }}>
              <Scale size={15} color="#fff" />
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ color: mood.text }}>LegalLens</span>
          </div>
          <button
            onClick={onToggleMode}
            className="p-2 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: muted }}
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Report content with scan line reveal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        {!scanDone ? (
          <ScanLineReveal accent={mood.accent} onComplete={() => setScanDone(true)}>
            {reportContent}
          </ScanLineReveal>
        ) : (
          reportContent
        )}
      </div>
      </div>
    </div>
  );
}
