
import React from 'react';
import type { AccessibilityInfo } from '../types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccessibilityCheckerProps {
  accessibilityInfo: AccessibilityInfo[];
}

const PassFailIcon: React.FC<{ pass: boolean }> = ({ pass }) => {
  return pass ? (
    <CheckCircle size={18} className="text-green-500" />
  ) : (
    <XCircle size={18} className="text-red-500" />
  );
};

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ accessibilityInfo }) => {
  return (
    <div className="bg-dark-100 rounded-lg p-6 border border-dark-200 h-full">
      <h3 className="text-lg font-bold text-dark-800 mb-4">Accessibility Check</h3>
      <p className="text-sm text-dark-500 mb-4">
        WCAG 2.1 contrast ratios for text on backgrounds.
      </p>
      <div className="space-y-3">
        {accessibilityInfo.map((item, index) => (
          <div key={index} className="bg-dark-50 p-3 rounded-md border border-dark-200">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-dark-700 capitalize">{item.combination[0]}</span>
                <span className="text-dark-400">on</span>
                <span className="font-semibold text-dark-700 capitalize">{item.combination[1]}</span>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-dark-600">
                <span className="font-mono bg-dark-200 px-2 py-1 rounded">
                    {item.contrastRatio.toFixed(2)}:1
                </span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" title="WCAG AA (Ratio >= 4.5)">
                        <PassFailIcon pass={item.wcagAA} /> AA
                    </div>
                    <div className="flex items-center gap-1.5" title="WCAG AAA (Ratio >= 7.0)">
                        <PassFailIcon pass={item.wcagAAA} /> AAA
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessibilityChecker;
