import { readFileSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr(), tailwindcss()],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-query': ['@tanstack/react-query'],
                    'vendor-radix': ['radix-ui'],
                    'vendor-sentry': ['@sentry/react'],
                    'vendor-dates': ['date-fns'],
                },
            },
        },
    },
});
