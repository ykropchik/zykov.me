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
		rolldownOptions: {
			output: {
				codeSplitting: {
					// React changes far less often than the app, so it gets its own cacheable chunk.
					groups: [{ name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ }],
				},
			},
		},
	},
	resolve: {
		alias: {
			'@styles': path.resolve(import.meta.dirname, './src/styles'),
		},
	},
});
