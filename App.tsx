
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { generateImage } from './services/geminiService';
import { GeneratedImage, GenerationSettings, AspectRatio, ImageSize } from './types';
import { ASPECT_RATIOS } from './constants.tsx';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    isPro: false,
    imageSize: '1K',
  });

  const handleProToggle = async () => {
    if (!settings.isPro) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Instructions say: assume key selection was successful after triggering openSelectKey()
          setSettings(prev => ({ ...prev, isPro: true }));
        } else {
          setSettings(prev => ({ ...prev, isPro: true }));
        }
      } catch (err) {
        console.error("Key selection failed", err);
      }
    } else {
      setSettings(prev => ({ ...prev, isPro: false }));
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, settings);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: settings.aspectRatio,
        model: settings.isPro ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash',
      };
      setImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (err: any) {
      if (err.message === "PRO_KEY_REQUIRED") {
        setError("PRO mode requires a paid API key. Please select one.");
        // Fix: Reset the Pro mode state and prompt the user to select a valid key.
        setSettings(prev => ({ ...prev, isPro: false }));
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "An error occurred during generation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#030712]">
      <Header />
      
      <main className="max-w-7xl mx-auto space-y-12">
        {/* Hero & Input Section */}
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Visualize your <span className="gradient-text">Imagination</span>
            </h1>
            <p className="text-lg text-gray-400">
              Transform your thoughts into stunning high-resolution artwork instantly with AI.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div className="relative flex flex-col md:flex-row gap-2 glass p-2 rounded-xl">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
              />
              <Button 
                type="submit" 
                size="lg" 
                isLoading={isLoading}
                disabled={!prompt.trim()}
              >
                Generate
              </Button>
            </div>
          </form>

          {/* Settings Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 glass rounded-2xl">
            <div className="flex flex-col items-start gap-2 px-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aspect Ratio</span>
              <div className="flex gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio.value }))}
                    title={ratio.label}
                    className={`p-2 rounded-lg transition-all ${
                      settings.aspectRatio === ratio.value 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {ratio.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden md:block" />

            <div className="flex flex-col items-start gap-2 px-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Engine Quality</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleProToggle}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    settings.isPro 
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' 
                      : 'bg-white/5 text-gray-400 border border-transparent'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${settings.isPro ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'}`} />
                  {settings.isPro ? 'Pro Engine (3.0)' : 'Flash Engine (2.5)'}
                </button>
                
                {settings.isPro && (
                  <select
                    value={settings.imageSize}
                    onChange={(e) => setSettings(s => ({ ...s, imageSize: e.target.value as ImageSize }))}
                    className="bg-white/5 text-gray-400 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none"
                  >
                    <option value="1K">1K Res</option>
                    <option value="2K">2K Res</option>
                    <option value="4K">4K Res</option>
                  </select>
                )}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-bounce">
              {error}
            </div>
          )}
        </section>

        {/* Gallery Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-semibold">Your Creations</h2>
            <p className="text-sm text-gray-500">{images.length} images generated</p>
          </div>

          {images.length === 0 && !isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center glass rounded-3xl border-dashed border-2 border-white/10 text-gray-500 gap-4">
              <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Start prompting to see your creations here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading && (
                <div className="relative overflow-hidden glass rounded-2xl animate-pulse aspect-square">
                  <div className="absolute inset-0 animate-shimmer" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Brewing your masterpiece...</p>
                  </div>
                </div>
              )}
              {images.map((img) => (
                <div key={img.id} className="group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="aspect-square relative overflow-hidden bg-gray-900">
                    <img 
                      src={img.url} 
                      alt={img.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-white line-clamp-2 font-medium">
                          {img.prompt}
                        </p>
                        <button 
                          onClick={() => downloadImage(img.url, `dreamgen-${img.id}.png`)}
                          className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs text-gray-500 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{img.aspectRatio}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{img.model}</span>
                    </div>
                    <span>{new Date(img.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-24 pt-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} DreamGen AI Studio. Powered by Gemini.</p>
      </footer>
    </div>
  );
}
