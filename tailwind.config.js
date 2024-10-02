	/** @type {import('tailwindcss').Config} */
	module.exports = {
		content: [
			"./imports/ui/**/*.{js,jsx,ts,tsx}",
			"./client/*.html",
		],
		theme: {
			extend: {
				colors: {
					beige: {
						1: '#f3f0d8'
					},
					rosegold: {
						1: '#b97171'
					},
					yellow: {
						1: '#f6cc08',
						2: '#e9ba14'
					},
					blue: {
						1: '#719cc6',
						2: '#5a8ca8',
					},
				}
			}
		},
		plugins: [],
	}

