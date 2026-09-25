/** @type {import("stylelint").Config} */
export default {
	extends: ['stylelint-config-recommended-scss'],
	plugins: [
		'@stylistic/stylelint-plugin',
	],
	rules: {
		'@stylistic/string-quotes': 'single',
		'@stylistic/indentation': 'tab',
	},
};
