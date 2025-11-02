
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generatePalette } from './services/geminiService';
import type { FullPaletteResponse, Model } from './types';
import Header from './components/Header';
import ColorSwatch from './components/ColorSwatch';
import CodeBlock from './components/CodeBlock';
import AccessibilityChecker from './components/AccessibilityChecker';
import UsageGuide from './components/UsageGuide';
import { Palette as PaletteIcon, Loader, Zap, KeyRound, ExternalLink } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [inputWords, setInputWords] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paletteData, setPaletteData] = useState<FullPaletteResponse | null>(null);
  const [history, setHistory] = useLocalStorage<FullPaletteResponse[]>('paletteHistory', []);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [model, setModel] = useState<Model>('gemini-2.5-flash');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a global function provided by the environment.
    // @ts-ignore
    window.aistudio.hasSelectedApiKey().then((hasKey: boolean) => {
      setIsApiKeySet(hasKey);
    });
  }, []);

  useEffect(() => {
    if (paletteData && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [paletteData]);

  useEffect(() => {
    if (paletteData?.previewHtml) {
        const blob = new Blob([paletteData.previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
            setPreviewUrl(null);
        };
    }
  }, [paletteData]);


  const handleSelectKey = async () => {
     // @ts-ignore
    await window.aistudio.openSelectKey();
    setIsApiKeySet(true); // Assume success to avoid race conditions
  };

  const handleGenerate = useCallback(async () => {
    if (!isApiKeySet) {
      setError('Please select an API key first.');
      return;
    }
    const words = inputWords.split(',').map(w => w.trim()).filter(Boolean);
    if (words.length !== 3) {
      setError('Please enter exactly 3 descriptive words, separated by commas.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setPaletteData(null);

    try {
      const result = await generatePalette(words, model);
      setPaletteData(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_INVALID") {
        setError('Your API key is invalid or not found. Please select a valid key.');
        setIsApiKeySet(false);
      } else {
        setError('Failed to generate palette. The AI might be busy. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputWords, setHistory, isApiKeySet, model]);

  const loadFromHistory = (item: FullPaletteResponse) => {
    setPaletteData(item);
    const wordsFromPalette = item.usageGuidelines.map(g => g.psychology.split(' ')[0]);
    setInputWords(wordsFromPalette.slice(0, 3).join(', '));
     if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const renderGenerator = () => (
    <>
      <div className="flex items-center justify-center gap-4 mb-8">
          <label className="font-semibold text-dark-600">Model:</label>
          <div className="flex items-center p-1 bg-dark-100 border border-dark-200 rounded-lg">
              {(['gemini-2.5-flash', 'gemini-2.5-pro'] as Model[]).map(m => (
                  <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${model === m ? 'bg-brand-primary text-white shadow' : 'text-dark-500 hover:bg-dark-200'}`}
                  >
                      {m.split('-').slice(2).join(' ')}
                  </button>
              ))}
          </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-dark-100 p-2 rounded-lg border border-dark-200 shadow-md">
        <input
          type="text"
          value={inputWords}
          onChange={(e) => setInputWords(e.target.value)}
          placeholder="e.g., bold, creative, modern"
          className="w-full bg-transparent p-3 text-dark-800 placeholder-dark-400 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? <Loader className="animate-spin" size={20} /> : <Zap size={20} />}
          <span>Generate</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-dark-50 text-dark-700 font-sans">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark-800 tracking-tight">
            Brand Colors in <span className="text-brand-primary">Seconds</span>, Not Hours
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-dark-500 max-w-2xl mx-auto">
            Generate a professional 5-color brand palette from just 3 words with our AI-powered tool.
          </p>
          <div className="mt-8 md:mt-12 max-w-xl mx-auto">
            {!isApiKeySet ? (
                <div className="bg-dark-100 border-2 border-dashed border-dark-300 rounded-lg p-6 text-center">
                    <KeyRound className="mx-auto text-brand-primary mb-3" size={32}/>
                    <h2 className="font-bold text-dark-800">API Key Required</h2>
                    <p className="text-sm text-dark-500 mt-1 mb-4">Please select your Google AI API key to continue.</p>
                     <p className="text-xs text-dark-400 mb-4">Access to the API may require a key with a configured billing account. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary">Learn more</a>.</p>
                    <button onClick={handleSelectKey} className="bg-brand-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-brand-primary-dark transition-colors">
                        Select API Key
                    </button>
                </div>
            ) : renderGenerator()}
            {error && <p className="mt-2 text-red-500 text-sm text-left">{error}</p>}
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-block relative">
              <PaletteIcon className="text-brand-primary animate-pulse" size={64} />
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <p className="mt-4 text-dark-500">Generating your masterpiece...</p>
          </div>
        )}

        {paletteData && (
          <div ref={resultsRef} className="mt-16 md:mt-24 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
              {Object.entries(paletteData.palette).map(([name, color]) => (
                <ColorSwatch key={name} name={name} colorInfo={color} />
              ))}
            </div>
            
            <div className="mt-16">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-dark-800">SaaS Preview</h2>
                  {previewUrl && (
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark">
                        <ExternalLink size={16} /> Open in new tab
                    </a>
                  )}
              </div>
              <div className="aspect-video w-full bg-dark-100 rounded-lg shadow-lg border border-dark-200 overflow-hidden">
                <iframe srcDoc={paletteData.previewHtml} className="w-full h-full border-0" title="SaaS Application Preview"></iframe>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UsageGuide guidelines={paletteData.usageGuidelines} />
              </div>
              <div>
                <AccessibilityChecker accessibilityInfo={paletteData.accessibility} />
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-dark-800 mb-4 text-center">Export Palette</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CodeBlock language="css" palette={paletteData.palette} />
                <CodeBlock language="tailwind" palette={paletteData.palette} />
                <CodeBlock language="scss" palette={paletteData.palette} />
                <CodeBlock language="json" palette={paletteData.palette} />
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && !paletteData && !isLoading && (
           <div className="mt-24">
            <h2 className="text-2xl font-bold text-dark-800 mb-6 text-center">Your Recent Palettes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((histItem, index) => (
                <div key={index} onClick={() => isApiKeySet && loadFromHistory(histItem)} className={`bg-dark-100 rounded-lg p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-dark-200 ${isApiKeySet ? 'cursor-pointer' : 'opacity-50'}`}>
                  <div className="flex -space-x-3">
                    {Object.values(histItem.palette).map(c => (
                      <div key={c.hex} style={{backgroundColor: c.hex}} className="w-10 h-10 rounded-full border-2 border-dark-100 shadow-md"></div>
                    ))}
                  </div>
                  <p className="text-sm text-dark-500 mt-3 truncate">{Object.values(histItem.palette).map(c => c.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;