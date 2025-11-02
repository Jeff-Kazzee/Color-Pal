
export interface ColorInfo {
  name: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
}

export interface Palette {
  primary: ColorInfo;
  secondary: ColorInfo;
  accent: ColorInfo;
  background: ColorInfo;
  text: ColorInfo;
}

export interface UsageGuideline {
  color: keyof Palette;
  do: string[];
  dont: string[];
  psychology: string;
}

export interface AccessibilityInfo {
  combination: [keyof Palette, keyof Palette];
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

export interface FullPaletteResponse {
  palette: Palette;
  usageGuidelines: UsageGuideline[];
  accessibility: AccessibilityInfo[];
  previewHtml: string;
}

export type Model = 'gemini-2.5-flash' | 'gemini-2.5-pro';