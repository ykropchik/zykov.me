import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
	root: 'src',
	publicDir: path.resolve(import.meta.dirname, './public'),
	plugins: [react()],
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		target: 'es2015',
	},
	resolve: {
		alias: {
			'@styles': path.resolve(import.meta.dirname, './src/styles'),
		},
	},
});
