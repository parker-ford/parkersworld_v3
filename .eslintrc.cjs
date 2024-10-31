module.exports = {
	root: true,
	extends: ['airbnb', 'prettier'],
	plugins: ['prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		camelcase: 'off',
		'class-methods-use-this': 'off',
		'no-console': 'off'
	}
};
