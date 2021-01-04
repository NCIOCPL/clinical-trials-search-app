// Call to reinitialize application.

beforeEach(() => {
	cy.on('window:before:load', (win) => {
		// This is the only setting that needs to be set across each application
		// load. this needs to occur before cy.visit() which will request the
		// page. Setting all defaults in order to make sure that a change
		// to development defaults does not break a bunch of texts.
		win.INT_TEST_APP_PARAMS = {
			analyticsName: 'Drug',
			apiEndpoint:'/api/drugdictionary/v1/',
			appId: '@@/DEFAULT_SWS_APP_ID',
			baseHost: 'http://localhost:3000',
			basePath: '/',
			canonicalHost: 'https://www.cancer.gov',
			language: 'en',
			rootId: 'NCI-app-root',
			siteName: 'National Cancer Institute',
			title: 'NCI Drug Dictionary',
			contentGroup: "NCI Drug Dictionary",
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
