module.exports = {
	extends: "eslint:recommended",
	parser: "vue-eslint-parser",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: "latest",
		ecmaFeatures: {
			globalReturn: false,
			impliedStrict: false,
			jsx: false
		},
		parser: {
			ts: "@typescript-eslint/parser"
		}
	},
	globals: {
		window: "readonly",
		console: "readonly",
		Promise: "readonly",
		HTMLInputElement: "readonly",
		setTimeout: "readonly"
	},
	rules: {
		"no-unused-vars": "off",
		"no-restricted-imports": [
			"error",
			{
				paths: [
					// only allow useStore()
					{
						importNames: ["store"],
						name: "./src/store",
						message: "Please use 'useStore()'"
					},
					{
						importNames: ["store"],
						name: "@/store",
						message: "Please use 'useStore()'"
					},
					// only allow useRouter()
					{
						importNames: ["router"],
						name: "./src/router",
						message: "Please use 'useRouter()'"
					},
					{
						importNames: ["router"],
						name: "@/router",
						message: "Please use 'useRouter()'"
					}
				]
			}
		],
		"func-style": ["error", "expression"],
		"no-var": ["error"]
	}
};
