
import { GoogleGenAI, Type } from "@google/genai";
import type { FullPaletteResponse, Model } from '../types';

const colorInfoSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A creative, semantic name for the color (e.g., "Midnight Sky").' },
        hex: { type: Type.STRING, description: 'The hex code of the color (e.g., "#0A192F").' },
        rgb: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: 'The RGB values [R, G, B].' },
        hsl: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: 'The HSL values [H, S, L].' },
    },
    required: ['name', 'hex', 'rgb', 'hsl'],
};

const paletteSchema = {
    type: Type.OBJECT,
    properties: {
        primary: { ...colorInfoSchema, description: "Primary action color (buttons, links)." },
        secondary: { ...colorInfoSchema, description: "Secondary elements (borders, cards)." },
        accent: { ...colorInfoSchema, description: "Highlights, badges, notifications." },
        background: { ...colorInfoSchema, description: "Main page background." },
        text: { ...colorInfoSchema, description: "Main text color." },
    },
    required: ['primary', 'secondary', 'accent', 'background', 'text'],
};

const usageGuidelineSchema = {
    type: Type.OBJECT,
    properties: {
        color: { type: Type.STRING, description: 'The role of the color (primary, secondary, etc.).' },
        do: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of recommended uses.' },
        dont: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of things to avoid.' },
        psychology: { type: Type.STRING, description: 'A brief explanation of the color\'s psychological impact in this context.' },
    },
    required: ['color', 'do', 'dont', 'psychology'],
};

const accessibilityInfoSchema = {
    type: Type.OBJECT,
    properties: {
        combination: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'The two color roles being compared (e.g., ["text", "background"]).' },
        contrastRatio: { type: Type.NUMBER, description: 'The calculated contrast ratio.' },
        wcagAA: { type: Type.BOOLEAN, description: 'Passes WCAG AA for normal text (ratio >= 4.5).' },
        wcagAAA: { type: Type.BOOLEAN, description: 'Passes WCAG AAA for normal text (ratio >= 7.0).' },
    },
    required: ['combination', 'contrastRatio', 'wcagAA', 'wcagAAA'],
};

const fullResponseSchema = {
    type: Type.OBJECT,
    properties: {
        palette: paletteSchema,
        usageGuidelines: { type: Type.ARRAY, items: usageGuidelineSchema },
        accessibility: { type: Type.ARRAY, items: accessibilityInfoSchema },
        previewHtml: { type: Type.STRING, description: "A single, self-contained HTML string for a SaaS dashboard mockup using the generated palette and Tailwind CSS." }
    },
    required: ['palette', 'usageGuidelines', 'accessibility', 'previewHtml'],
};

export async function generatePalette(words: string[], model: Model): Promise<FullPaletteResponse> {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set. Please select an API key.");
    }
    
    // Create a new instance for each call to use the latest key.
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      As an expert brand designer, UI/UX developer, and color theorist, generate a professional, aesthetically pleasing 5-color palette and a corresponding SaaS dashboard mockup based on these three words: "${words.join(', ')}".

      The palette must be harmonious, accessible, and practical for web design.
      
      Provide the following structure in your JSON response:
      1.  **Palette**: 5 colors (primary, secondary, accent, background, text) with creative names, hex, RGB, and HSL values. The background color should be suitable for a SaaS application dashboard.
      2.  **Usage Guidelines**: For each of the 5 colors, provide a "do" list, a "don't" list, and the color's psychology.
      3.  **Accessibility**: Calculate and provide the contrast ratio for all meaningful text/background combinations (e.g., text on background, primary on background, text on primary), and state if they pass WCAG AA and AAA for normal text.
          - Key combinations to check: text on background, text on primary, text on secondary, primary on background, secondary on background.
      4.  **Preview HTML**: A single, self-contained HTML string for a polished SaaS dashboard mockup.
          - The HTML MUST use the generated color palette with inline styles or a style block.
          - It MUST use Tailwind CSS via the CDN ('https://cdn.tailwindcss.com').
          - It MUST include Google Fonts ('Inter').
          - The design should be modern, clean, and visually appealing, reflecting the input words.
          - It MUST NOT contain any external script tags other than Tailwind CSS and Google Fonts.
          - All styling should be done with Tailwind classes directly in the HTML elements.
          - Use placeholder comments for icons (e.g., <!-- icon: chart -->) instead of actual SVG tags to keep the HTML clean and concise.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: fullResponseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (!parsedData.palette || !parsedData.usageGuidelines || !parsedData.accessibility || !parsedData.previewHtml) {
            throw new Error("Invalid response structure from AI");
        }
        
        return parsedData as FullPaletteResponse;

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        if (error.message?.includes("API key not valid") || error.message?.includes("Requested entity was not found")) {
            throw new Error("API_KEY_INVALID");
        }
        throw new Error("Failed to generate palette from AI service.");
    }
}