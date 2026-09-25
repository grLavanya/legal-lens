import type { ParsedDocument } from '@/types';
import type { ExtractedPage } from '@/lib/extractText';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const responseSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        category: { type: 'string', enum: ['property', 'employment', 'court', 'financial', 'estate', 'general'] },
        detected_roles: { type: 'array', items: { type: 'string' } },
        clauses: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    clause_ref: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
                    page: { type: 'integer' },
                    excerpt: { type: 'string' },
                    relevant_to: { type: 'array', items: { type: 'string' } },
                },
                required: ['clause_ref', 'title', 'description', 'risk_level', 'page', 'excerpt', 'relevant_to'],
            },
        },
    },
    required: ['title', 'subtitle', 'category', 'detected_roles', 'clauses'],
};

export async function analyzeDocument(pages: ExtractedPage[], fileName: string): Promise<ParsedDocument> {
    const documentText = pages.map((p) => `[Page ${p.page}]\n${p.text}`).join('\n\n');

    const prompt = `You are analyzing a legal document for a non-lawyer. Read the full text below and produce a structured analysis.

For each significant clause (aim for 4-8 of the most important ones — not every clause, just what matters):
- Give it a short, plain-language title
- Explain what it means and why it matters in 1-2 sentences, in plain English
- Assess risk_level: "high" if it's unusual, one-sided, or costly for the reader; "medium" if standard but worth knowing; "low" if routine/favorable
- Note which detected roles/parties it's most relevant to
- Include a short verbatim excerpt from the source text
- Note the page number where it appears

Also identify:
- category: the single best fit from property, employment, court, financial, estate, or general
- detected_roles: the actual parties/roles present in THIS document (e.g. "tenant", "landlord" — not a generic list)
- title: a short document title
- subtitle: a one-line descriptor

Never give legal advice, predictions, or verdicts — only explain what the document says.

Document text:
${documentText}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema,
                },
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Gemini returned no analysis. Try again.');

    const parsed = JSON.parse(raw);

    return {
        id: `upload-${Date.now()}`,
        title: parsed.title,
        subtitle: parsed.subtitle,
        category: parsed.category,
        detected_roles: parsed.detected_roles,
        clauses: parsed.clauses.map((c: any, i: number) => ({
            id: `c${i + 1}`,
            clause_ref: c.clause_ref,
            title: c.title,
            description: c.description,
            risk_level: c.risk_level,
            source: { page: c.page, clause_ref: c.clause_ref },
            relevant_to: c.relevant_to,
            excerpt: c.excerpt,
        })),
        fullText: pages.map((p) => ({ page: p.page, clause_ref: '', text: p.text })),
    };
}