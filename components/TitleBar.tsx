import React from 'react';
import { Globe } from 'lucide-react';

interface TitleBarProps {
  title: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  return (
    <div className="app-title-bar h-8 bg-neutral-100 dark:bg-neutral-900 flex items-center px-4 w-full fixed top-0 z-[60] border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 overflow-hidden">
        <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
        <span className="font-medium whitespace-nowrap truncate">{title}</span>
      </div>
    </div>
  );
};