import type { ParsedDocument, SourceLocator } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ChatAnswer {
    answer: string;
    source: SourceLocator | null;
}

export async function askQuestion(document: ParsedDocument, question: string): Promise<ChatAnswer> {
    const documentText = document.fullText
        .map((p) => `[Page ${p.page}${p.clause_ref ? `, ${p.clause_ref}` : ''}]\n${p.text}`)
        .join('\n\n');

    const prompt = `You are a legal-document assistant helping a non-lawyer understand a document. Answer the question using ONLY the document text below. Never give legal advice, predictions, or a verdict — explain what the document says, in plain language.

If the answer isn't covered in the document text, say exactly: "This isn't covered in the document." Do not guess or infer beyond what's written.

If you do find the answer, also state which page and section/clause number it comes from, in this exact format at the very end of your answer on its own line:
SOURCE: page=<number>, ref=<section or clause reference, or "none" if not applicable>

Document text:
${documentText}

Question: ${question}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const sourceMatch = raw.match(/SOURCE:\s*page=(\d+),\s*ref=(.+)/i);
    const answer = raw.replace(/SOURCE:.*$/is, '').trim();

    if (!sourceMatch || sourceMatch[2].trim().toLowerCase() === 'none') {
        return { answer, source: null };
    }

    return {
        answer,
        source: { page: parseInt(sourceMatch[1], 10), clause_ref: sourceMatch[2].trim() },
    };
}