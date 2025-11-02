
import React from 'react';
import type { Palette } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language: 'css' | 'scss' | 'tailwind' | 'json';
  palette: Palette;
}

const generateCode = (language: string, palette: Palette): string => {
  const kebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  
  switch (language) {
    case 'css':
      return `:root {\n${Object.entries(palette)
        .map(([name, { hex }]) => `  --${kebabCase(name)}: ${hex};`)
        .join('\n')}\n}`;
    case 'scss':
      return `${Object.entries(palette)
        .map(([name, { hex }]) => `$${kebabCase(name)}: ${hex};`)
        .join('\n')}`;
    case 'tailwind':
      return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(palette)
        .map(([name, { hex }]) => `        ${name}: '${hex}',`)
        .join('\n')}
      },
    },
  },
};`;
    case 'json':
      return JSON.stringify(palette, null, 2);
    default:
      return '';
  }
};

const languageTitles: Record<string, string> = {
    css: 'CSS Variables',
    scss: 'SCSS Variables',
    tailwind: 'Tailwind Config',
    json: 'JSON',
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, palette }) => {
  const [isCopied, copy] = useCopyToClipboard();
  const code = generateCode(language, palette);

  return (
    <div className="bg-dark-100 rounded-lg overflow-hidden border border-dark-200">
      <div className="flex justify-between items-center p-3 bg-dark-200/50">
        <p className="text-sm font-semibold text-dark-700">{languageTitles[language]}</p>
        <button
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 text-xs text-dark-500 hover:text-brand-primary transition-colors"
        >
          {isCopied ? <><Check size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto text-dark-600">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
