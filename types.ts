export enum BrowserTabStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}

export interface VideoResource {
  id: string;
  url: string;
  title: string;
  size?: string;
  type: string;
}

export interface SearchResult {
  type: 'url' | 'search' | 'ai_response';
  content: string;
}

export interface HistoryItem {
  url: string;
  title: string;
  timestamp: number;
}

export interface SearchEngine {
  name: string;
  urlTemplate: string; // Use %s as placeholder for query
  icon: string;
}

export interface Bookmark {
  name: string;
  url: string;
  icon?: string; // Emoji or character
}