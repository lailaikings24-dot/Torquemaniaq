import React from 'react';
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
const isPrivacyPage = canonicalPath(window.location.pathname) === PRIVACY_PATH;

createRoot(container).render(
  <React.StrictMode>{isPrivacyPage ? <Privacy /> : <App />}</React.StrictMode>,
);

// Must run before React so the browser's install event is not missed.
initInstallCapture();

// Offline app shell. Production only — a dev service worker serves stale modules.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
