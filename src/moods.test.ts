import { describe, it, expect } from 'vitest';
import { getMood, riskOpacity, MOODS } from './moods';

describe('moods', () => {
    it('has all 6 mood categories defined', () => {
        expect(Object.keys(MOODS)).toHaveLength(6);
        expect(MOODS.property).toBeDefined();
        expect(MOODS.court).toBeDefined();
    });

    it('getMood returns the correct palette for a category and mode', () => {
        const result = getMood('financial', 'light');
        expect(result.accent).toBe('#1E4620');
        expect(result.bg).toBe('#F0F8F0');
    });

    it('getMood returns different values for light vs dark mode', () => {
        const light = getMood('estate', 'light');
        const dark = getMood('estate', 'dark');
        expect(light.accent).not.toBe(dark.accent);
    });

    it('riskOpacity returns decreasing opacity for lower risk', () => {
        expect(riskOpacity('high')).toBe(1);
        expect(riskOpacity('medium')).toBe(0.7);
        expect(riskOpacity('low')).toBe(0.5);
    });
});