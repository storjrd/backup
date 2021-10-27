module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				storjBlue: "#0149FF"
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [require("@tailwindcss/forms")]
};
