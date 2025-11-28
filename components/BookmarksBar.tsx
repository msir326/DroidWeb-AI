import React from 'react';
import { Bookmark } from '../types';

// Dummy bookmarks for demonstration
const DUMMY_BOOKMARKS: Bookmark[] = [
  { name: 'Google', url: 'https://google.com', icon: 'G' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'YT' },
  { name: 'GitHub', url: 'https://github.com', icon: '</>' },
  { name: 'AI News', url: 'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB', icon: '🤖' },
  { name: 'React Docs', url: 'https://react.dev', icon: '⚛️' }
];

interface BookmarksBarProps {
  onNavigate: (url: string) => void;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({ onNavigate }) => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 shadow-sm overflow-x-auto">
      {DUMMY_BOOKMARKS.map(bookmark => (
        <button 
          key={bookmark.name}
          onClick={() => onNavigate(bookmark.url)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors shrink-0"
        >
          <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {bookmark.icon}
          </div>
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{bookmark.name}</span>
        </button>
      ))}
    </div>
  );
};