import { useState } from 'react';
import { Upload, FileText, Sparkles, Moon, Sun, Shield, Scale, FileSearch } from 'lucide-react';
import { SHELL } from '@/moods';
import type { ThemeMode } from '@/types';
import { SAMPLE_DOCUMENTS } from '@/mockData';
import type { ParsedDocument } from '@/types';
import { extractTextFromFile, type ExtractedPage } from '@/lib/extractText';

interface UploadScreenProps {
  mode: ThemeMode;
  onToggleMode: () => void;
  onSelectDocument: (doc: ParsedDocument) => void;
  onFileUploaded: (pages: ExtractedPage[], fileName: string) => Promise<void>;
}

export function UploadScreen({ mode, onToggleMode, onSelectDocument, onFileUploaded }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const pages = await extractTextFromFile(file);
      const fullText = pages.map((p) => p.text).join('\n\n');

      if (fullText.trim().length < 50) {
        throw new Error('Could not extract readable text from this file. Try a different document.');
      }

      await onFileUploaded(pages, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong reading this file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ''; // allow re-selecting the same file later
  };

  const handleSampleClick = (doc: ParsedDocument) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onSelectDocument(doc);
    }, 1800);
  };

  const bg = mode === 'dark' ? SHELL.nearBlack : SHELL.paperWhite;
  const text = mode === 'dark' ? SHELL.paperWhite : SHELL.nearBlack;
  const muted = SHELL.warmGrey;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: bg, color: text, transition: 'background 0.6s, color 0.6s' }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: SHELL.indigo }}
          >
            <Scale size={20} color="#fff" />
          </div>
          <span className="text-lg font-bold tracking-tight">LegalLens</span>
        </div>
        <button
          onClick={onToggleMode}
          className="p-2 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: muted }}
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="max-w-2xl w-full text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: mode === 'dark' ? 'rgba(107,95,255,0.15)' : 'rgba(107,95,255,0.1)', color: SHELL.indigo }}
          >
            <Sparkles size={13} />
            AI-powered legal document analysis
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Understand any legal document
            <br />
            <span style={{ color: SHELL.indigo }}>in plain language</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: muted }}>
            Upload a contract, lease, notice, or agreement. Get a clear breakdown of what matters —
            flagged clauses, risks, and plain-language explanations, all traceable to the source.
          </p>
        </div>

        {/* Upload zone */}
        <div className="max-w-2xl w-full mb-10">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300"
            style={{
              borderColor: isDragging ? SHELL.indigo : (mode === 'dark' ? '#2A2A2E' : '#D8D4CE'),
              background: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
              transform: isDragging ? 'scale(1.01)' : 'scale(1)',
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileInputChange}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: SHELL.indigo }} />
                </div>
                <span className="text-sm font-medium" style={{ color: muted }}>Analyzing document...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: mode === 'dark' ? 'rgba(107,95,255,0.15)' : 'rgba(107,95,255,0.1)' }}
                >
                  <Upload size={26} color={SHELL.indigo} />
                </div>
                <div>
                  <p className="text-base font-semibold mb-1">Drop your document here, or click to browse</p>
                  <p className="text-sm" style={{ color: muted }}>PDF or TXT — up to 50MB</p>
                </div>
                {error && (
                  <p className="text-sm mt-1" style={{ color: '#DC2626' }}>{error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sample documents */}
        <div className="max-w-3xl w-full">
          <div className="flex items-center gap-2 mb-4">
            <FileSearch size={16} color={muted} />
            <span className="text-sm font-medium" style={{ color: muted }}>Or try a sample document</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAMPLE_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSampleClick(doc)}
                disabled={uploading}
                className="text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
                  borderColor: mode === 'dark' ? '#2A2A2E' : '#E0DDD8',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: mode === 'dark' ? 'rgba(107,95,255,0.15)' : 'rgba(107,95,255,0.08)' }}
                  >
                    <FileText size={18} color={SHELL.indigo} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{doc.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: muted }}>{doc.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-12 flex items-center gap-2 text-xs" style={{ color: muted }}>
          <Shield size={14} />
          <span>Your documents are processed securely and never stored.</span>
        </div>
      </main>
    </div>
  );
}