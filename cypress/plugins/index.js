/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const cucumber = require('@badeball/cypress-cucumber-preprocessor');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', cucumber());
  return config;
}
const createBundler = require('@badeball/cypress-cucumber-preprocessor/webpackr')
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin

module.exports = async (on, config) => {
	await addCucumberPreprocessorPlugin(on, config)

	on(
		'file:preprocessor',
		createBundler({
			plugins: [],
		})
	)

	return config
}
