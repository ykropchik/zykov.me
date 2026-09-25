import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
	root: 'src',
	plugins: [react()],
	resolve: {
		alias: {
			'@styles': path.resolve(import.meta.dirname, './src/styles'),
		},
	},
});
