// const { defineConfig } = require('cypress')
//
// module.exports = defineConfig({
// 	video: false,
// 	retries: 1,
// 	e2e: {
// 		// We've imported your old cypress plugins here.
// 		// You may want to clean this up later by importing these.
// 		setupNodeEvents(on, config) {
// 			return require('./cypress/plugins/index.js')(on, config)
// 		},
// 		specPattern: 'cypress/e2e/**/*.feature',
// 		baseUrl: 'http://localhost:3000',
// 	},
// })
//

const { defineConfig } = require("cypress");
const webpack = require("@cypress/webpack-preprocessor");
const {
	addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");

async function setupNodeEvents(on, config) {
	// This is required for the preprocessor to be able to generate JSON reports after each run, and more,
	await addCucumberPreprocessorPlugin(on, config);

	on(
		"file:preprocessor",
		webpack({
			webpackOptions: {
				resolve: {
					extensions: [".ts", ".js"],
				},
				module: {
					rules: [
						{
							test: /\.feature$/,
							use: [
								{
									loader: "@badeball/cypress-cucumber-preprocessor/webpack",
									options: config,
								},
							],
						},
					],
				},
			},
		})
	);

	// Make sure to return the config object as it might have been modified by the plugin.
	return config;
}

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: "cypress/e2e/**/*.feature",
		setupNodeEvents,
	},
});
