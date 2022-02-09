module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				storjBlue: "#0149FF"
			},
			backgroundImage: (theme) => ({
				"world-map": "url('assets/worldMap.svg')"
			})
		}
	},
	variants: {
		scrollbar: ["rounded"],
		extend: {
			display: ["group-hover"]
		}
	},
	plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")]
};
