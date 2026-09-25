import type { ParsedDocument, PrepQuestion } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generatePrepQuestions(
    document: ParsedDocument,
    role: string | null
): Promise<PrepQuestion[]> {
    const documentText = document.fullText
        .map((p) => `[Page ${p.page}${p.clause_ref ? `, ${p.clause_ref}` : ''}]\n${p.text}`)
        .join('\n\n');

    const roleContext = role && role !== 'general'
        ? `The user identifies as: "${role}". Tailor the questions to what matters most for someone in that role.`
        : `The user hasn't specified a role — ask broadly useful questions covering the most important parts of the document.`;

    const prompt = `You are helping a non-lawyer prepare for a conversation with a legal professional about the document below. ${roleContext}

Generate 3-5 specific, concrete questions they should ask a lawyer about this document. Each question should reference a specific clause or term from the actual document text, not be generic. Never give legal advice yourself — only generate the questions.

Return ONLY a JSON array, no other text, in this exact shape:
[{"question": "...", "context": "one sentence on why this matters", "page": <number or null>, "clause_ref": "<string or null>"}]

Document text:
${documentText}`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' },
            }),
        }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('No questions generated. Try again.');

    const parsed = JSON.parse(raw);

    return parsed.map((q: any, i: number) => ({
        id: `q-gen-${i}`,
        question: q.question,
        context: q.context,
        source: q.page ? { page: q.page, clause_ref: q.clause_ref ?? '' } : undefined,
    }));
}