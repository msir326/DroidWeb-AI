import React, { useState, useEffect } from 'react';
import { Search, RotateCw, Lock, Mic, X, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { getSmartSearchResponse } from '../services/geminiService';

type DeviceMode = 'mobile' | 'desktop';

interface AddressBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  searchUrlTemplate: string;
  deviceMode: DeviceMode;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onHome: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const AddressBar: React.FC<AddressBarProps> = ({ 
  currentUrl, 
  onNavigate, 
  isLoading, 
  onRefresh, 
  searchUrlTemplate,
  deviceMode,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onHome,
  inputRef
}) => {
  const [inputVal, setInputVal] = useState(currentUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputVal(currentUrl);
    }
  }, [currentUrl, isFocused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let target = inputVal.trim();
    
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(target) || /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(target) || /^localhost(:\d+)?(\/.*)?$/.test(target);
    
    if (isUrl) {
      if (!/^https?:\/\//i.test(target)) {
        target = 'https://' + target;
      }
      onNavigate(target);
      (document.activeElement as HTMLElement).blur();
    } else {
      const searchUrl = searchUrlTemplate.replace('%s', encodeURIComponent(target));
      onNavigate(searchUrl);
      (document.activeElement as HTMLElement).blur();

      setIsAiThinking(true);
      setAiSuggestion(null);
      try {
        const answer = await getSmartSearchResponse(target);
        setAiSuggestion(answer);
      } catch (e) {
      } finally {
        setIsAiThinking(false);
      }
    }
  };

  const NavControls = () => (
    <div className="flex items-center gap-1 mr-2">
      <button onClick={onBack} disabled={!canGoBack} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ArrowLeft className="w-5 h-5" /></button>
      <button onClick={onForward} disabled={!canGoForward} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ArrowRight className="w-5 h-5" /></button>
      <button onClick={onRefresh} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"><RotateCw className="w-5 h-5" /></button>
      <button onClick={onHome} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"><Home className="w-5 h-5 text-emerald-500" /></button>
    </div>
  );

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 px-3 py-2 flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 shadow-md relative z-40">
      {deviceMode === 'desktop' && <NavControls />}

      <div className={`flex-1 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center px-4 border transition-colors ${isFocused ? 'border-emerald-500/50 bg-white dark:bg-neutral-800' : 'border-transparent'}`}>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />
        ) : isFocused ? (
           <Search className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-3" />
        ) : (
           <Lock className="w-3 h-3 text-emerald-500 mr-3" />
        )}
        
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            className="w-full h-10 bg-transparent text-black dark:text-white placeholder-neutral-500 focus:outline-none text-sm font-medium"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search or type URL"
            autoCapitalize="off"
            autoComplete="off"
          />
        </form>

        {inputVal && isFocused && (
          <button onClick={() => setInputVal('')} className="ml-2 text-neutral-500 hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
        
        {deviceMode === 'mobile' && !isFocused && (
             <button onClick={onRefresh} className="ml-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
               <RotateCw className="w-4 h-4" />
             </button>
        )}
        
        {isFocused && (
           <Mic className="w-4 h-4 text-neutral-500 dark:text-neutral-400 ml-2" />
        )}
      </div>

      {(aiSuggestion || isAiThinking) && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-3 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden p-4">
           <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
               <span className="text-white text-xs font-bold">AI</span>
             </div>
             <div className="flex-1">
               {isAiThinking ? (
                 <div className="space-y-2">
                   <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                   <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse"></div>
                 </div>
               ) : (
                 <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">{aiSuggestion}</p>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};