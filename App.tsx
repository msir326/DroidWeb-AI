import React, { useState, useEffect, useRef } from 'react';
import { AddressBar } from './components/AddressBar';
import { BottomNav } from './components/BottomNav';
import { BookmarksBar } from './components/BookmarksBar';
import { VideoDownloader } from './components/VideoDownloader';
import { TitleBar } from './components/TitleBar';
import { VideoResource, BrowserTabStatus, SearchEngine } from './types';
import { Maximize, Minimize, Settings, Moon, Smartphone, LayoutGrid, Download, Search, Check, Globe, Sun, Monitor, Tablet, RefreshCw } from 'lucide-react';

const HOME_URL = 'about:home';
const DEMO_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEMO_VIDEO_TITLE = 'Flower Blooming (Demo)';

const SEARCH_ENGINES: SearchEngine[] = [
  { name: 'Google', urlTemplate: 'https://www.google.com/search?q=%s', icon: 'G' },
  { name: 'Bing', urlTemplate: 'https://www.bing.com/search?q=%s', icon: 'B' },
  { name: 'DuckDuckGo', urlTemplate: 'https://duckduckgo.com/?q=%s', icon: 'D' },
  { name: 'Baidu', urlTemplate: 'https://www.baidu.com/s?wd=%s', icon: '百度' },
  { name: 'Yahoo', urlTemplate: 'https://search.yahoo.com/search?p=%s', icon: 'Y!' },
];

const HomePage = ({ 
    onDemoClick, 
    onSearch, 
    currentEngine 
}: { 
    onDemoClick: () => void, 
    onSearch: (q: string) => void,
    currentEngine: SearchEngine
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="min-h-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="space-y-2 mt-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent select-none">
          DroidWeb
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto text-sm">
          AI-Powered Privacy Browser
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-sm relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded">
             {currentEngine.icon}
          </div>
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search with ${currentEngine.name} or type URL`}
          className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white pl-12 pr-4 py-4 rounded-full shadow-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-neutral-500 dark:placeholder:text-neutral-600"
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
        {[
          { name: 'Google', icon: 'G', url: 'https://google.com' },
          { name: 'YouTube', icon: 'Y', url: 'https://youtube.com' },
          { name: 'Reddit', icon: 'R', url: 'https://reddit.com' },
          { name: 'Wiki', icon: 'W', url: 'https://wikipedia.org' }
        ].map((site) => (
          <button 
            key={site.name}
            onClick={() => onSearch(site.url)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 group-hover:border-emerald-500/30 transition-all">
              <span className="font-bold text-lg text-neutral-600 dark:text-neutral-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400">{site.icon}</span>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300">{site.name}</span>
          </button>
        ))}
      </div>

      <div className="p-6 bg-neutral-100/30 dark:bg-neutral-900/30 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 max-w-sm w-full mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neutral-900 dark:text-white font-medium text-sm">Video Detection Demo</h3>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">Feature</span>
        </div>
        <button 
          onClick={onDemoClick}
          className="w-full py-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm rounded-lg font-medium transition-colors border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
        >
          Load Test Video
        </button>
      </div>
    </div>
  );
};

type Theme = 'light' | 'dark';
type ViewMode = 'mobile' | 'desktop';
type DeviceMode = 'mobile' | 'desktop';

const App: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState(HOME_URL);
  const [pageTitle, setPageTitle] = useState('DroidWeb AI');
  const [history, setHistory] = useState<string[]>([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [status, setStatus] = useState<BrowserTabStatus>(BrowserTabStatus.IDLE);
  const [showNav, setShowNav] = useState(true);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [showDownloads, setShowDownloads] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorkerRegistration | null>(null);

  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('droidweb_theme') as Theme) || 'dark');
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('droidweb_viewmode') as ViewMode) || 'mobile');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => (localStorage.getItem('droidweb_devicemode') as DeviceMode) || 'mobile');
  const [searchEngine, setSearchEngine] = useState<SearchEngine>(() => {
    const saved = localStorage.getItem('droidweb_engine');
    return SEARCH_ENGINES.find(e => e.name === saved) || SEARCH_ENGINES[0];
  });
  
  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setWaitingWorker(registration);
    setUpdateAvailable(true);
  };
  
  useEffect(() => {
    const handleSWUpdate = (e: Event) => {
        const registration = (e as CustomEvent).detail;
        onSWUpdate(registration);
    };
    window.addEventListener('swUpdate', handleSWUpdate);
    return () => window.removeEventListener('swUpdate', handleSWUpdate);
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
        waitingWorker.waiting?.postMessage({ type: 'SKIP_WAITING' });
        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }
  };


  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    localStorage.setItem('droidweb_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('droidweb_viewmode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('droidweb_devicemode', deviceMode);
  }, [deviceMode]);

  useEffect(() => {
    localStorage.setItem('droidweb_engine', searchEngine.name);
  }, [searchEngine]);

  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const addressBarInputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (url: string) => {
    let nextUrl = url;
    const isUrl = /^(http|https):\/\//.test(nextUrl) || /^about:/.test(nextUrl) || /\.[a-z]{2,}/.test(nextUrl);
    
    if (nextUrl !== HOME_URL && !isUrl) {
       nextUrl = searchEngine.urlTemplate.replace('%s', encodeURIComponent(nextUrl));
    } else if (nextUrl === 'home' || nextUrl === 'about:home') {
        nextUrl = HOME_URL;
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => (historyIndex > 0) && setHistoryIndex(i => i - 1);
  const handleForward = () => (historyIndex < history.length - 1) && setHistoryIndex(i => i + 1);
  
  useEffect(() => {
    const url = history[historyIndex];
    setCurrentUrl(url);
    if (url === HOME_URL) {
      setPageTitle('DroidWeb AI - Home');
    } else if (url.includes('flower.mp4')) {
      setPageTitle(DEMO_VIDEO_TITLE);
    } else {
      try {
        const hostname = new URL(url).hostname;
        setPageTitle(hostname.replace(/^www\./, ''));
      } catch {
        setPageTitle(url);
      }
    }
    setStatus(BrowserTabStatus.LOADING);
    setVideos([]);
    
    const timer = setTimeout(() => {
        setStatus(BrowserTabStatus.LOADED);
        if (url.includes('flower') || url.includes('demo')) {
          setVideos([{ id: 'demo-vid-1', url: DEMO_VIDEO_URL, title: DEMO_VIDEO_TITLE, size: '2.4 MB', type: 'video/mp4' }]);
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, [historyIndex, history]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || deviceMode === 'desktop') return;
    const currentScrollY = scrollContainerRef.current.scrollTop;
    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      setShowNav(currentScrollY <= lastScrollY.current || currentScrollY <= 50);
      lastScrollY.current = currentScrollY;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L or Alt+D to focus address bar
      if ((e.ctrlKey && e.key === 'l') || (e.altKey && e.key === 'd')) {
        e.preventDefault();
        addressBarInputRef.current?.focus();
        addressBarInputRef.current?.select();
      }
      // Ctrl+R or F5 to refresh
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        handleNavigate(currentUrl);
      }
      // Alt + Left/Right for history
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleForward();
      }
       // Alt + Home for home
      if (e.altKey && e.key === 'Home') {
        e.preventDefault();
        handleNavigate(HOME_URL);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUrl, handleBack, handleForward]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      appContainerRef.current?.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setShowMenu(false);
  };

  const toggleAppMode = () => {
    const nextMode = !isAppMode;
    setIsAppMode(nextMode);
    if (nextMode && !document.fullscreenElement) {
        appContainerRef.current?.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
    } else if (!nextMode && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
    }
    setShowMenu(false);
  };

  const handleDeviceModeChange = (newMode: DeviceMode) => {
    setDeviceMode(newMode);
    handleNavigate(HOME_URL);
    setShowMenu(false);
    setShowSettingsModal(false);
  };

  const renderContent = () => {
    if (currentUrl === HOME_URL) {
      return <HomePage onDemoClick={() => handleNavigate(DEMO_VIDEO_URL + '?demo=true')} onSearch={handleNavigate} currentEngine={searchEngine} />;
    }

    if (currentUrl.includes('demo=true')) {
      return (
        <div className="w-full min-h-full bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-start pt-20 p-4 space-y-6">
          <div className="w-full max-w-2xl bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <video controls autoPlay loop className="w-full aspect-video"><source src={DEMO_VIDEO_URL} type="video/mp4" /></video>
            <div className="p-4 bg-white dark:bg-neutral-800">
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">{DEMO_VIDEO_TITLE}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">This is a demo page to demonstrate video detection.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full h-full bg-white flex flex-col ${viewMode === 'desktop' ? 'overflow-x-auto' : 'overflow-hidden'}`}>
        <div className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-2 text-xs text-neutral-500 text-center truncate px-4">
          {viewMode === 'desktop' && <Monitor className="inline w-3 h-3 mr-2" />} {currentUrl}
        </div>
        <iframe 
          key={currentUrl + viewMode} // Force reload on viewMode change
          src={currentUrl} 
          className={`border-none flex-1 ${viewMode === 'desktop' ? 'w-[1280px] h-full' : 'w-full h-full'}`}
          title="Browser View" sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <div className="absolute inset-0 top-32 pointer-events-none flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-md text-white p-6 rounded-2xl max-w-sm text-center pointer-events-auto border border-neutral-700 shadow-2xl mx-4">
            <h3 className="font-bold text-lg mb-2 text-emerald-400">Security Restriction</h3>
            <p className="text-sm text-neutral-300 mb-4">Real websites block embedding for security. In a real Android app, this would render.</p>
            <button onClick={() => window.open(currentUrl, '_blank')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-sm font-medium transition-colors">Open in New Tab</button>
          </div>
        </div>
      </div>
    );
  };

  const isDesktopPWA = isStandalone && deviceMode === 'desktop';

  return (
    <div ref={appContainerRef} className="flex flex-col h-screen w-screen bg-white dark:bg-neutral-950 text-black dark:text-white overflow-hidden relative touch-action-none">
      
      {isDesktopPWA && <TitleBar title={pageTitle} />}

      <div className={`${isDesktopPWA ? 'pt-8' : ''}`}>
        {!isAppMode && (
          <div className={`transition-transform duration-300 z-50 ${!showNav && currentUrl !== HOME_URL && deviceMode === 'mobile' ? '-translate-y-full' : 'translate-y-0'}`}>
              <AddressBar 
                inputRef={addressBarInputRef}
                currentUrl={currentUrl === HOME_URL ? '' : currentUrl} 
                onNavigate={handleNavigate} 
                isLoading={status === BrowserTabStatus.LOADING} 
                onRefresh={() => handleNavigate(currentUrl)} 
                searchUrlTemplate={searchEngine.urlTemplate} 
                deviceMode={deviceMode}
                canGoBack={historyIndex > 0}
                canGoForward={historyIndex < history.length - 1}
                onBack={handleBack}
                onForward={handleForward}
                onHome={() => handleNavigate(HOME_URL)}
              />
              {deviceMode === 'desktop' && <BookmarksBar onNavigate={handleNavigate} />}
              {status === BrowserTabStatus.LOADING && (
              <div className="h-0.5 w-full bg-neutral-200 dark:bg-neutral-800">
                  <div className="h-full bg-emerald-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3" />
              </div>
              )}
          </div>
        )}
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className={`flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth ${isAppMode ? 'h-full pb-0' : ''} ${isDesktopPWA ? 'h-[calc(100%-32px)]' : ''}`}>
        {renderContent()}
      </div>

      {isAppMode && (
        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 z-[60] animate-in slide-in-from-bottom duration-300">
             {videos.length > 0 && (
                 <button onClick={() => setShowDownloads(true)} className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-black/50 flex items-center justify-center hover:scale-110 transition-transform" title="Download Video">
                     <Download className="w-5 h-5" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{videos.length}</span>
                 </button>
             )}
             <button onClick={toggleAppMode} className="w-14 h-14 rounded-full bg-neutral-800/80 backdrop-blur border border-white/10 text-white shadow-lg shadow-black/50 flex items-center justify-center hover:bg-neutral-700 transition-colors" title="Exit App Mode">
                 <LayoutGrid className="w-6 h-6" />
             </button>
        </div>
      )}

      {showMenu && !isAppMode && deviceMode === 'mobile' && (
        <div className="absolute bottom-24 right-4 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
           <div className="space-y-1">
             <button onClick={() => handleDeviceModeChange('desktop')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left"><Tablet className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /><span className="text-sm font-medium">Switch to Desktop Mode</span></button>
             <button onClick={toggleAppMode} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left"><Smartphone className="w-5 h-5 text-neutral-500" /><span className="text-sm font-medium">App Mode (PWA)</span></button>
             <button onClick={toggleFullscreen} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left">{isFullscreen ? <Minimize className="w-5 h-5 text-neutral-500" /> : <Maximize className="w-5 h-5 text-neutral-500" />}<span className="text-sm font-medium">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span></button>
             <button onClick={() => { setShowMenu(false); setShowSettingsModal(true); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-left"><Settings className="w-5 h-5 text-neutral-500" /><span className="text-sm font-medium">Settings</span></button>
           </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
                   <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-emerald-500" /> Settings</h2>
                   <button onClick={() => setShowSettingsModal(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"><LayoutGrid className="w-5 h-5 text-neutral-500 dark:text-neutral-400" /></button>
               </div>
               
               <div className="p-4 max-h-[70vh] overflow-y-auto space-y-6">
                   <div className="space-y-3">
                       <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Device Mode</h3>
                       <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => handleDeviceModeChange('mobile')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${deviceMode === 'mobile' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Smartphone className="w-5 h-5" /> <span className="text-sm font-medium">Mobile Mode</span></button>
                           <button onClick={() => handleDeviceModeChange('desktop')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${deviceMode === 'desktop' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Tablet className="w-5 h-5" /> <span className="text-sm font-medium">Desktop Mode</span></button>
                       </div>
                   </div>
                   <div className="space-y-3">
                       <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Appearance</h3>
                       <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => setTheme('light')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Sun className="w-5 h-5" /> <span className="text-sm font-medium">Light</span></button>
                           <button onClick={() => setTheme('dark')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Moon className="w-5 h-5" /> <span className="text-sm font-medium">Dark</span></button>
                       </div>
                   </div>
                   <div className="space-y-3">
                       <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Content Preferences</h3>
                       <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => setViewMode('mobile')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${viewMode === 'mobile' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Smartphone className="w-5 h-5" /> <span className="text-sm font-medium">Mobile View</span></button>
                           <button onClick={() => setViewMode('desktop')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${viewMode === 'desktop' ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'}`}><Monitor className="w-5 h-5" /> <span className="text-sm font-medium">Desktop View</span></button>
                       </div>
                   </div>
                   <div className="space-y-3">
                       <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Search Engine</h3>
                       <div className="space-y-1">
                           {SEARCH_ENGINES.map((engine) => (
                               <button key={engine.name} onClick={() => setSearchEngine(engine)} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${searchEngine.name === engine.name ? 'bg-neutral-100 dark:bg-neutral-800 border-emerald-500/50' : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                                   <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs font-bold">{engine.icon}</div><span className="font-medium">{engine.name}</span></div>
                                   {searchEngine.name === engine.name && <Check className="w-4 h-4 text-emerald-500" />}
                               </button>
                           ))}
                       </div>
                   </div>
                   <div className="text-center pt-2">
                       <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">DroidWeb AI</p>
                       <p className="text-xs text-neutral-500 mt-1">Version 1.5.0</p>
                   </div>
               </div>
           </div>
        </div>
      )}

      {deviceMode === 'mobile' && <BottomNav isVisible={showNav && !isAppMode} canGoBack={historyIndex > 0} canGoForward={historyIndex < history.length - 1} onBack={handleBack} onForward={handleForward} onHome={() => handleNavigate(HOME_URL)} onToggleMenu={() => setShowMenu(!showMenu)} onOpenDownloads={() => setShowDownloads(true)} videoCount={videos.length} />}
      <VideoDownloader videos={videos} isOpen={showDownloads} onClose={() => setShowDownloads(false)} />
      
      {updateAvailable && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto bg-neutral-900/90 dark:bg-neutral-200/90 backdrop-blur-md text-white dark:text-black p-3 rounded-full shadow-2xl z-[100] flex items-center gap-4 animate-in slide-in-from-bottom duration-500">
            <p className="text-sm font-medium">A new version is available!</p>
            <button onClick={handleUpdate} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black rounded-full text-sm font-bold transition-colors">
                <RefreshCw className="w-4 h-4" /> Update
            </button>
        </div>
      )}
      
      <style>{`
        @keyframes loading {0% { margin-left: -30%; width: 30%; } 50% { width: 60%; } 100% { margin-left: 100%; width: 10%; }}
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default App;