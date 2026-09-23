import type { ReactNode } from 'react';
import type { MoodCategory, ThemeMode } from '@/types';
import { getMood } from '@/moods';

interface SheetProps {
  category: MoodCategory;
  mode: ThemeMode;
  children: ReactNode;
  className?: string;
}

export function Sheet({ category, mode, children, className }: SheetProps) {
  const mood = getMood(category, mode);

  return (
    <div
      className={`relative rounded-2xl shadow-2xl ${className ?? ''}`}
      style={{
        background: mood.sheetBg,
        border: `1px solid ${mood.sheetBorder}`,
        transition: 'background 0.8s ease, border-color 0.8s ease',
      }}
    >
      {children}
    </div>
  );
}
