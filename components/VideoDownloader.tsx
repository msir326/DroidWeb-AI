import React, { useState } from 'react';
import { Download, Check, X, Film, AlertCircle } from 'lucide-react';
import { VideoResource } from '../types';

interface VideoDownloaderProps {
  videos: VideoResource[];
  isOpen: boolean;
  onClose: () => void;
}

export const VideoDownloader: React.FC<VideoDownloaderProps> = ({ videos, isOpen, onClose }) => {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleDownload = async (video: VideoResource) => {
    setDownloadingIds(prev => new Set(prev).add(video.id));
    
    try {
      const response = await fetch(video.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Extract filename from URL or use title
      const fileName = video.title || `video-${Date.now()}.mp4`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setCompletedIds(prev => new Set(prev).add(video.id));
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. CORS restrictions may prevent downloading external resources in this demo.");
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(video.id);
        return newSet;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm pointer-events-auto" 
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-neutral-900 w-full sm:w-96 max-h-[70vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl pointer-events-auto border border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-500" />
            Detected Media ({videos.length})
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-500 dark:text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 opacity-50" />
              <p>No videos detected on this page.</p>
              <p className="text-xs">Try playing a video first.</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="bg-neutral-100 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700/50 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2" title={video.title}>
                    {video.title || "Untitled Video"}
                  </span>
                  <span className="text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded">
                    {video.type.split('/')[1]?.toUpperCase() || 'MP4'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-neutral-500">{video.size || 'Unknown size'}</span>
                  
                  {completedIds.has(video.id) ? (
                    <button className="flex items-center gap-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full">
                      <Check className="w-3 h-3" /> Downloaded
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDownload(video)}
                      disabled={downloadingIds.has(video.id)}
                      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                        downloadingIds.has(video.id)
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-wait'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                      }`}
                    >
                      {downloadingIds.has(video.id) ? (
                        <>Downloading...</>
                      ) : (
                        <><Download className="w-3 h-3" /> Download</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/90 text-[10px] text-neutral-500 dark:text-neutral-600 text-center rounded-b-2xl border-t border-neutral-200 dark:border-neutral-800">
           Note: Direct downloads may be limited by browser security (CORS).
        </div>
      </div>
    </div>
  );
};