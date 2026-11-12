import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const allowed = (process.env.VITE_ALLOWED_HOSTS || '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

const server: Record<string, unknown> = {
  host: '0.0.0.0',
  port: 3000,
  strictPort: true,
};
if (allowed.length) server.allowedHosts = allowed;

export default defineConfig({
  plugins: [react()],
  server,
  preview: server,
  build: { target: 'es2022' },
});
