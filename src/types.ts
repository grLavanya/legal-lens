export type MoodCategory =
  | 'property'
  | 'employment'
  | 'court'
  | 'financial'
  | 'estate'
  | 'general';

export type ThemeMode = 'light' | 'dark';

export interface MoodPalette {
  category: MoodCategory;
  label: string;
  light: {
    accent: string;
    accentSoft: string;
    bg: string;
    bgGradient: string;
    text: string;
    textMuted: string;
    sheetBg: string;
    sheetBorder: string;
  };
  dark: {
    accent: string;
    accentSoft: string;
    bg: string;
    bgGradient: string;
    text: string;
    textMuted: string;
    sheetBg: string;
    sheetBorder: string;
  };
}

export interface SourceLocator {
  page: number;
  clause_ref: string;
}

export interface FlaggedClause {
  id: string;
  clause_ref: string;
  title: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high';
  source: SourceLocator;
  relevant_to: string[];
  excerpt: string;
}

export interface DocumentMeta {
  title: string;
  subtitle: string;
  category: MoodCategory;
  detected_roles: string[];
}

export interface ParsedDocument extends DocumentMeta {
  id: string;
  clauses: FlaggedClause[];
  fullText: { page: number; clause_ref: string; text: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: SourceLocator;
  grounded: boolean;
}

export interface PrepQuestion {
  id: string;
  question: string;
  context: string;
  source?: SourceLocator;
}

export type AppView = 'upload' | 'report';
