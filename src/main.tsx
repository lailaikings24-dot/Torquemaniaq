import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Privacy } from './pages/Privacy';
import { canonicalPath, PRIVACY_PATH } from './lib/routes';
import { initInstallCapture } from './lib/platform';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element missing');

// The policy is a real page, not a screen: it has no connection state and must
// be readable by someone who has never paired an adapter (or by a store
// reviewer). It shares the build, fonts and colours but none of the shell.
//
// The switch listens for popstate rather than reading the path once, so the
// Tools link can move between the two without a document request — inside the
// Android WebView, a request for /privacy would 404 (Capacitor only falls back
// to index.html for extensionless paths in HTML5 mode).
function Root() {
  const [path, setPath] = useState(() => canonicalPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(canonicalPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return path === PRIVACY_PATH ? <Privacy /> : <App />;
}

// Must run before React so the browser's install event is not missed.
initInstallCapture();

createRoot(container).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// Offline app shell. Production only — a dev service worker serves stale modules.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
