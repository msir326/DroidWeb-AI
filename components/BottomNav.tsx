import React from 'react';
import { ArrowLeft, ArrowRight, Home, Tablet, Film } from 'lucide-react';

interface BottomNavProps {
  isVisible: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onHome: () => void;
  onToggleMenu: () => void;
  onOpenDownloads: () => void;
  videoCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  isVisible,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onHome,
  onToggleMenu,
  onOpenDownloads,
  videoCount
}) => {
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out z-40 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-around items-center px-4 py-2">
        <button 
          onClick={onBack} 
          disabled={!canGoBack}
          className={`p-3 rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors ${!canGoBack ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={onForward} 
          disabled={!canGoForward}
          className={`p-3 rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors ${!canGoForward ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'}`}
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <button 
          onClick={onHome}
          className="p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 text-emerald-500 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-900/20 active:scale-95 transition-all"
        >
          <Home className="w-6 h-6" />
        </button>

        <button 
          onClick={onOpenDownloads}
          className="p-3 rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white relative"
        >
          <Film className="w-6 h-6" />
          {videoCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {videoCount}
            </span>
          )}
        </button>

        <button 
          onClick={onToggleMenu}
          className="p-3 rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
        >
          <Tablet className="w-6 h-6" />
        </button>
      </div>
      
      <div className="pb-safe"></div>
    </div>
  );
};