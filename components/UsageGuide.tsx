
import React from 'react';
import type { UsageGuideline } from '../types';
import { ThumbsUp, ThumbsDown, BrainCircuit } from 'lucide-react';

interface UsageGuideProps {
  guidelines: UsageGuideline[];
}

const UsageGuide: React.FC<UsageGuideProps> = ({ guidelines }) => {
  return (
    <div className="bg-dark-100 rounded-lg p-6 border border-dark-200">
      <h3 className="text-lg font-bold text-dark-800 mb-4">Usage Guidelines</h3>
      <div className="space-y-6">
        {guidelines.map((guide) => (
          <div key={guide.color}>
            <h4 className="font-bold text-dark-700 capitalize mb-3">{guide.color}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <p className="flex items-center gap-2 font-semibold text-green-700"><ThumbsUp size={16} /> Do</p>
                    <ul className="list-disc list-inside text-dark-600 space-y-1 pl-2">
                        {guide.do.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div className="space-y-2">
                    <p className="flex items-center gap-2 font-semibold text-red-700"><ThumbsDown size={16} /> Don't</p>
                     <ul className="list-disc list-inside text-dark-600 space-y-1 pl-2">
                        {guide.dont.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
            <div className="mt-3 text-sm bg-dark-50 p-3 rounded-md border border-dark-200">
                 <p className="flex items-center gap-2 font-semibold text-brand-primary-dark mb-1"><BrainCircuit size={16} /> Psychology</p>
                 <p className="text-dark-600">{guide.psychology}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageGuide;
