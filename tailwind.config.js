module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				"inter-black": ["Inter-black", "sans-serif"],
				"inter-bold": ["Inter-bold", "sans-serif"],
				"inter-extrabold": ["Inter-extrabold", "sans-serif"],
				"inter-extralight": ["Inter-extralight", "sans-serif"],
				"inter-light": ["Inter-light", "sans-serif"],
				"inter-medium": ["Inter-medium", "sans-serif"],
				inter: ["Inter", "sans-serif"],
				"inter-semibold": ["Inter-semibold", "sans-serif"],
				"inter-thin": ["Inter-thin", "sans-serif"]
			},
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
