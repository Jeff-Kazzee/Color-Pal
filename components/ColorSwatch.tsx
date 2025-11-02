
import React from 'react';
import type { ColorInfo } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Copy, Check } from 'lucide-react';

interface ColorSwatchProps {
  name: string;
  colorInfo: ColorInfo;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, colorInfo }) => {
  const [isCopied, copy] = useCopyToClipboard();

  return (
    <div className="text-center group flex flex-col items-center">
      <div
        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dark-100 shadow-lg transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: colorInfo.hex }}
        aria-label={`${colorInfo.name} - ${colorInfo.hex}`}
      />
      <div className="mt-4">
        <p className="font-bold text-dark-700 capitalize">{name}</p>
        <p className="text-sm text-dark-600">{colorInfo.name}</p>
        <button
          onClick={() => copy(colorInfo.hex)}
          className="mt-1 font-mono text-sm text-dark-500 flex items-center gap-1 hover:text-brand-primary transition-colors"
        >
          {colorInfo.hex}
          {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default ColorSwatch;
