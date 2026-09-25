import * as pdfjsLib from 'pdfjs-dist';

// Use the CDN worker matching your installed version — avoids Vite bundling headaches
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ExtractedPage {
    page: number;
    text: string;
}

export async function extractTextFromFile(file: File): Promise<ExtractedPage[]> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'txt') {
        const text = await file.text();
        return [{ page: 1, text }];
    }

    if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages: ExtractedPage[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map((item: any) => item.str).join(' ');
            pages.push({ page: i, text });
        }
        return pages;
    }

    throw new Error(`Unsupported file type: .${ext}. Please upload a PDF or TXT file.`);
}