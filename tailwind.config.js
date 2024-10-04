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
						1: '#f3f0d8',
						2: '#ffffef'
					},
					rosegold: {
						1: '#b97171',
						2: '#ffd6d5'
					},
					yellow: {
						1: '#f6cc08',
						2: '#e9ba14',
						3: '#fdff3c'
					},
					blue: {
						1: '#719cc6',
						2: '#5a8ca8',
						3: '#a7ebff'
					},
				}
			}
		},
		plugins: [],
	}

