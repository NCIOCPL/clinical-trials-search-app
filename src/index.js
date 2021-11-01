import './polyfills';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './store/reducers';
import { loadStateFromSessionStorage } from './utilities';
import createCTSMiddleware from './middleware/CTSMiddleware';
import cacheMiddleware from './middleware/cacheMiddleware';
import { ClinicalTrialsServiceFactory } from '@nciocpl/clinical-trials-search-client.js';

import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';

// Global Context
import { StateProvider } from './store/store';
import ctx_reducer from './store/ctx-reducer';

import App from './App';
import './index.css';

const initialize = ({
	appHasBeenVisited = false,
	appHasBeenInitialized = false,
	analyticsChannel = 'About Cancer',
	// This should still be configurable in case someone is hosting
	// this outside of the digital platform, and wants to hookup
	// their own analytics. See index.html for an overly complicated
	// configuration that handles logging to the console.
	analyticsHandler = 'EddlAnalyticsHandler',
	analyticsContentGroup = 'Clinical Trials',
	analyticsName = 'Clinical Trials',
	analyticsPublishedDate = 'unknown',
	appId = '@@/DEFAULT_CTS_APP_ID',
	baseHost = 'http://localhost:3000',
	basePath = '/about-cancer/treatment/clinical-trials/search',
	canonicalHost = 'https://www.cancer.gov',
	ctsTitle = 'Find NCI-Supported Clinical Trials',
	initErrorsList = [],
	language = 'en',
	printCacheEndpoint = '/CTS.Print/GenCache',
	rootId = 'NCI-CTS-root',
	siteName = 'National Cancer Institute',
	useSessionStorage = true,
	zipConversionEndpoint = '/cts_api/zip_code_lookup',
	// These have been added in to support integration testing.
	// This should default to being the hardcoded default.
	// (Which should not be the proxy...)
	ctsHostname = 'clinicaltrialsapi.cancer.gov',
	ctsProtocol = 'https',
	ctsPort = null,
} = {}) => {
	const appRootDOMNode = document.getElementById(rootId);
	const isRehydrating = appRootDOMNode.getAttribute('data-isRehydrating');

	let cachedState;

	const services = {};
	const ctsSearch = () => {
		const service = ClinicalTrialsServiceFactory.create(
			ctsHostname,
			'v1',
			ctsProtocol,
			ctsPort
		);
		return service;
	};
	services.ctsSearch = ctsSearch;

	// Populate global state with init params
	const initialState = {
		appHasBeenVisited,
		appHasBeenInitialized,
		appId,
		analyticsChannel,
		analyticsContentGroup,
		analyticsName,
		analyticsPublishedDate,
		baseHost,
		basePath,
		canonicalHost,
		ctsTitle,
		initErrorsList,
		language,
		printCacheEndpoint,
		rootId,
		services,
		siteName,
		useSessionStorage,
		zipConversionEndpoint,
		ctsHostname,
		ctsProtocol,
		ctsPort,
	};

	if (process.env.NODE_ENV !== 'development' && useSessionStorage === true) {
		cachedState = loadStateFromSessionStorage(appId);
	}

	// Set up middleware chain for redux dispatch.
	// const historyMiddleware = createHistoryMiddleware(history);

	const ctsMiddleware = createCTSMiddleware(services);

	const store = createStore(
		combineReducers(reducers),
		cachedState,
		composeWithDevTools(applyMiddleware(cacheMiddleware, ctsMiddleware))
	);

	// With the store now created, we want to subscribe to updates.
	// This implementation updates session storage backup on each store change.
	// If for some reason that proves too heavy, it's simple enough to scope to
	// only specific changes (like the url);
	//TODO: Only in prod?
	if (useSessionStorage === true) {
		const saveDesiredStateToSessionStorage = () => {};

		store.subscribe(saveDesiredStateToSessionStorage);
	}

	// Determine the analytics HoC we are going to use.
	// The following allows the app to be more portable, cgov will
	// default to using EDDL Analytics. Other sites could supplier
	// their own custom handler.
	const AnalyticsHoC = ({ children }) =>
		analyticsHandler === 'EddlAnalyticsHandler' ? (
			<EddlAnalyticsProvider
				pageLanguage={language === 'es' ? 'spanish' : 'english'}
				pageChannel={analyticsChannel}
				pageContentGroup={analyticsContentGroup}
				pageName={analyticsName}
				publishedDate={analyticsPublishedDate}
				analyticsName={analyticsName}>
				{children}
			</EddlAnalyticsProvider>
		) : (
			<AnalyticsProvider analyticsHandler={analyticsHandler}>
				{children}
			</AnalyticsProvider>
		);

	AnalyticsHoC.propTypes = {
		children: PropTypes.node,
	};

	const AppBlock = () => {
		return (
			<StateProvider initialState={initialState} reducer={ctx_reducer}>
				<Provider store={store}>
					<AnalyticsHoC>
						<Router>
							<App
								services={services}
								zipConversionEndpoint={zipConversionEndpoint}
							/>
						</Router>
					</AnalyticsHoC>
				</Provider>
			</StateProvider>
		);
	};

	if (isRehydrating) {
		ReactDOM.hydrate(<AppBlock />, appRootDOMNode);
	} else {
		ReactDOM.render(<AppBlock />, appRootDOMNode);
	}
	return appRootDOMNode;
};

export default initialize;

// expose initialize to window for AppModule integration
window.CTSApp = initialize;

// The following lets us run the app in dev not in situ as would normally be the case.
const appParams = window.APP_PARAMS || {};
const integrationTestOverrides = window.INT_TEST_APP_PARAMS || {};
if (process.env.NODE_ENV !== 'production') {
	//This is DEV
	const dictSettings = {
		...appParams,
		...integrationTestOverrides,
	};
	initialize(dictSettings);
}
