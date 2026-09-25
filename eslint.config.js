import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

const stylisticConfig = stylistic.configs.customize({
	indent: 'tab',
	quotes: 'single',
	braceStyle: '1tbs',
	commaDangle: 'always-multiline',
	quoteProps: 'as-needed',
	arrowParens: true,
	blockSpacing: true,
	semi: true,
	jsx: true,
});

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,mjs,jsx,ts,mts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			stylisticConfig,
		],
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			'@stylistic/jsx-one-expression-per-line': 'off',
		},
	},
]);
