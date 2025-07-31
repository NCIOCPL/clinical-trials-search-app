// Call to reinitialize application.

beforeEach(() => {
	cy.on('window:before:load', (win) => {
		// This is the only setting that needs to be set across each application
		// load. this needs to occur before cy.visit() which will request the
		// page. Setting all defaults in order to make sure that a change
		// to development defaults does not break a bunch of texts.
		win.INT_TEST_APP_PARAMS = {
			analyticsName: 'Clinical Trials',
			appId: '@@/DEFAULT_CTS_APP_ID',
			baseHost: 'http://localhost:3000',
			basePath: '/',
			canonicalHost: 'https://www.cancer.gov',
			ctsApiEndpointV1: '/v1',
			ctsApiEndpointV2: '/cts/mock-api/v2',
			ctsTitle: 'Find Cancer Clinical Trials',
			printApiBase: '/mock-api/cts-print',
			language: 'en',
			rootId: 'NCI-CTS-root',
			siteName: 'NCI',
			title: 'NCI Drug Dictionary',
			contentGroup: 'Clinical Trials',
			zipConversionEndpoint: '/mock-api/zip_code_lookup',
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
