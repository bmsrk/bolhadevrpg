import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { DEV_SERVER_PORT } from './config';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Set base path for GitHub Pages deployment
      // For GitHub Pages: https://<username>.github.io/<repo-name>/
      // Update 'bolhadevrpg' if repository name changes
      base: mode === 'production' ? '/bolhadevrpg/' : '/',
      server: {
        port: DEV_SERVER_PORT,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
