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
			basePath: '/about-cancer/treatment/clinical-trials/search',
			canonicalHost: 'https://www.cancer.gov',
			ctsApiEndpointV1: '/v1',
			ctsTitle: 'Find NCI-Supported Clinical Trials',
			language: 'en',
			rootId: 'NCI-CTS-root',
			siteName: 'National Cancer Institute',
			title: 'NCI Drug Dictionary',
			contentGroup: 'Clinical Trials',
			zipConversionEndpoint: '/mock-api/zip_code_lookup',
			ctsHostname: 'localhost',
			ctsProtocol: 'http',
			ctsPort: 3000,
		};
		console.log(win.INT_TEST_APP_PARAMS);
	});
});
