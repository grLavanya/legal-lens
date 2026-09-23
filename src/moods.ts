import type { MoodCategory, MoodPalette, ThemeMode } from '@/types';

export const SHELL = {
  nearBlack: '#141416',
  paperWhite: '#F5F3EF',
  indigo: '#6B5FFF',
  warmGrey: '#8F8A82',
};

export const MOODS: Record<MoodCategory, MoodPalette> = {
  property: {
    category: 'property',
    label: 'Property',
    light: {
      accent: '#C05621',
      accentSoft: '#E07A4C',
      bg: '#FDF6F0',
      bgGradient: 'linear-gradient(135deg, #FDF6F0 0%, #F9E8D8 100%)',
      text: '#2D2418',
      textMuted: '#8A7560',
      sheetBg: '#FFFCF8',
      sheetBorder: '#E8D5C4',
    },
    dark: {
      accent: '#F6AD55',
      accentSoft: '#FBD0A0',
      bg: '#1A1410',
      bgGradient: 'linear-gradient(135deg, #1A1410 0%, #2A1F15 100%)',
      text: '#F5E6D3',
      textMuted: '#A89070',
      sheetBg: '#231C15',
      sheetBorder: '#3A2E20',
    },
  },
  employment: {
    category: 'employment',
    label: 'Employment',
    light: {
      accent: '#2B6CB0',
      accentSoft: '#5A9BD8',
      bg: '#F0F6FC',
      bgGradient: 'linear-gradient(135deg, #F0F6FC 0%, #D8E8F5 100%)',
      text: '#1A2A3A',
      textMuted: '#6A8090',
      sheetBg: '#F8FBFE',
      sheetBorder: '#C8DCE8',
    },
    dark: {
      accent: '#63B3ED',
      accentSoft: '#90CFF4',
      bg: '#0F1A2A',
      bgGradient: 'linear-gradient(135deg, #0F1A2A 0%, #162640 100%)',
      text: '#D8E8F5',
      textMuted: '#7090B0',
      sheetBg: '#152538',
      sheetBorder: '#2A4060',
    },
  },
  court: {
    category: 'court',
    label: 'Court',
    light: {
      accent: '#9B2C2C',
      accentSoft: '#C75555',
      bg: '#FCF0F0',
      bgGradient: 'linear-gradient(135deg, #FCF0F0 0%, #F5D8D8 100%)',
      text: '#2A1818',
      textMuted: '#8A6060',
      sheetBg: '#FEF8F8',
      sheetBorder: '#E8C8C8',
    },
    dark: {
      accent: '#FC8181',
      accentSoft: '#FCA8A8',
      bg: '#1A0F0F',
      bgGradient: 'linear-gradient(135deg, #1A0F0F 0%, #2A1515 100%)',
      text: '#F5D8D8',
      textMuted: '#A87070',
      sheetBg: '#231515',
      sheetBorder: '#3A2020',
    },
  },
  financial: {
    category: 'financial',
    label: 'Financial',
    light: {
      accent: '#1E4620',
      accentSoft: '#4A8A4D',
      bg: '#F0F8F0',
      bgGradient: 'linear-gradient(135deg, #F0F8F0 0%, #D0E8D0 100%)',
      text: '#1A2A1A',
      textMuted: '#5A7A5A',
      sheetBg: '#F8FCF8',
      sheetBorder: '#C0DCC0',
    },
    dark: {
      accent: '#48BB78',
      accentSoft: '#7AD89A',
      bg: '#0F1A10',
      bgGradient: 'linear-gradient(135deg, #0F1A10 0%, #162620 100%)',
      text: '#D0E8D0',
      textMuted: '#609070',
      sheetBg: '#152518',
      sheetBorder: '#2A4030',
    },
  },
  estate: {
    category: 'estate',
    label: 'Estate',
    light: {
      accent: '#92661C',
      accentSoft: '#B89040',
      bg: '#FAF5EA',
      bgGradient: 'linear-gradient(135deg, #FAF5EA 0%, #F0E4C8 100%)',
      text: '#2A2218',
      textMuted: '#8A7A5A',
      sheetBg: '#FEFBF3',
      sheetBorder: '#E0D0B0',
    },
    dark: {
      accent: '#D4A94C',
      accentSoft: '#E8C878',
      bg: '#1A150E',
      bgGradient: 'linear-gradient(135deg, #1A150E 0%, #2A2218 100%)',
      text: '#F0E4C8',
      textMuted: '#A89060',
      sheetBg: '#231D12',
      sheetBorder: '#3A3020',
    },
  },
  general: {
    category: 'general',
    label: 'General',
    light: {
      accent: '#334155',
      accentSoft: '#64748B',
      bg: '#F4F5F7',
      bgGradient: 'linear-gradient(135deg, #F4F5F7 0%, #E0E3E8 100%)',
      text: '#1E2A38',
      textMuted: '#6A7A88',
      sheetBg: '#FAFBFC',
      sheetBorder: '#D0D8E0',
    },
    dark: {
      accent: '#CBD5E0',
      accentSoft: '#A0B0C0',
      bg: '#12141A',
      bgGradient: 'linear-gradient(135deg, #12141A 0%, #1E2028 100%)',
      text: '#D0D8E0',
      textMuted: '#808898',
      sheetBg: '#1A1D24',
      sheetBorder: '#2E323C',
    },
  },
};

export function getMood(category: MoodCategory, mode: ThemeMode) {
  return MOODS[category][mode];
}

export function riskColor(risk: 'low' | 'medium' | 'high', accent: string): string {
  if (risk === 'high') return accent;
  if (risk === 'medium') return accent;
  return accent;
}

export function riskOpacity(risk: 'low' | 'medium' | 'high'): number {
  if (risk === 'high') return 1;
  if (risk === 'medium') return 0.7;
  return 0.5;
}
