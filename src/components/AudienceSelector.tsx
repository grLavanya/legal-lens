import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import type { ThemeMode } from '@/types';
import { getMood, SHELL } from '@/moods';
import type { MoodCategory } from '@/types';

interface AudienceSelectorProps {
  category: MoodCategory;
  mode: ThemeMode;
  roles: string[];
  selected: string | null;
  onChange: (role: string | null) => void;
}

const FALLBACK = 'Show me everything';

export function AudienceSelector({ category, mode, roles, selected, onChange }: AudienceSelectorProps) {
  const [open, setOpen] = useState(false);
  const mood = getMood(category, mode);
  const muted = SHELL.warmGrey;

  const options = [...roles, FALLBACK];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          background: selected ? `${mood.accent}15` : (mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          border: `1px solid ${selected ? `${mood.accent}40` : (mode === 'dark' ? '#2A2A2E' : '#E0DDD8')}`,
          color: selected ? mood.accent : (mode === 'dark' ? SHELL.paperWhite : SHELL.nearBlack),
        }}
      >
        <span className="capitalize">
          {selected ?? 'Filter by your role'}
        </span>
        <ChevronDown size={15} style={{ color: muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-2 right-0 z-20 min-w-[200px] rounded-xl shadow-xl py-1.5"
            style={{
              background: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
              border: `1px solid ${mode === 'dark' ? '#2A2A2E' : '#E0DDD8'}`,
            }}
          >
            {options.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onChange(role === FALLBACK ? null : role);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors hover:bg-black/5"
                style={{
                  color: (selected === role || (role === FALLBACK && selected === null))
                    ? mood.accent
                    : (mode === 'dark' ? SHELL.paperWhite : SHELL.nearBlack),
                }}
              >
                <span className="capitalize">{role}</span>
                {(selected === role || (role === FALLBACK && selected === null)) && (
                  <Check size={15} style={{ color: mood.accent }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
