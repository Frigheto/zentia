import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                termos: resolve(__dirname, 'termos.html'),
                privacidade: resolve(__dirname, 'privacidade.html'),
            },
        },
        minify: 'terser',
        cssMinify: true,
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },
});
