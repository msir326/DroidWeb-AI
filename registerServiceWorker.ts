export default function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Fix: Construct an absolute URL using window.location.origin.
      // This resolves the "origin mismatch" error where the browser resolves
      // relative paths against a different domain (e.g. ai.studio) than the sandbox.
      // We assume the file is served at /public/service-worker.js based on the project structure.
      const swUrl = new URL('public/service-worker.js', window.location.origin).href;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the updated precached content has been fetched,
                    // but the old service worker will still serve the older
                    // content until all client tabs are closed.
                    console.log('New content is available; please refresh.');
                    
                    // Dispatch a custom event to notify the app
                    const event = new CustomEvent('swUpdate', { detail: registration });
                    window.dispatchEvent(event);
                  } else {
                    // At this point, everything has been precached.
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}