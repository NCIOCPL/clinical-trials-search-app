import './polyfills';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Router } from 'react-router-dom';
import { history } from './services/history.service';
import * as reducers from './store/reducers';
import { loadStateFromSessionStorage } from './utilities';

import './index.css';
import createCTSMiddleware from './middleware/CTSMiddleware';
import cacheMiddleware from './middleware/cacheMiddleware';
import { ClinicalTrialsServiceFactory } from '@nciocpl/clinical-trials-search-client.js';

import App from './App';
import { AnalyticsProvider, EddlAnalyticsProvider } from './tracking';

const initialize = ({
  analyticsChannel = 'About Cancer',
  // This should still be configurable in case someone is hosting
  // this outside of the digital platform, and wants to hookup
  // their own analytics. See index.html for an overly complicated
  // configuration that handles logging to the console.
  analyticsHandler = 'EddlAnalyticsHandler',
  analyticsContentGroup = 'NCI Clinical Trials Search',
  analyticsName = 'Clinical Trials',
  analyticsPublishedDate = 'unknown',
  appId = '@@/DEFAULT_CTS_APP_ID',
  baseHost = 'http://localhost:3000',
  basePath = '/about-cancer/treatment/clinical-trials/search',
  canonicalHost = 'https://www.cancer.gov',
  ctsTitle = 'Find NCI-Supported Clinical Trials',
  language = 'en',
  printCacheEndpoint = '/CTS.Print/GenCache',
  rootId = 'NCI-CTS-root',
  services = {},
  siteName = 'National Cancer Institute',
  useSessionStorage = true,
  zipConversionEndpoint = '/cts_api/zip_code_lookup',
} = {}) => {
  let cachedState;

  const ctsSearch = () => {
    const hostName = 'ctsproxy.cancer.gov';
    const service = ClinicalTrialsServiceFactory.create(hostName);
    return service;
  };
  services.ctsSearch = ctsSearch;
  // Populate global state with init params
  const initialState = {
    appId,
    analyticsChannel,
    analyticsContentGroup,
    analyticsName,
    analyticsPublishedDate,
    baseHost,
    basePath,
    canonicalHost,
    ctsTitle,
    language,
    printCacheEndpoint,
    rootId,
    services,
    siteName,
    useSessionStorage,
    zipConversionEndpoint
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

  store.dispatch({
    type: 'LOAD_GLOBALS',
    payload: {...initialState},
  });

  // With the store now created, we want to subscribe to updates.
  // This implementation updates session storage backup on each store change.
  // If for some reason that proves too heavy, it's simple enough to scope to
  // only specific changes (like the url);
  //TODO: Only in prod?
  if (useSessionStorage === true) {
    const saveDesiredStateToSessionStorage = () => {
      const state = store.getState();
      // const { form, ...state } = allState;
      // saveStatetoSessionStorage({
      //   state,
      //   appId,
      // });
    };

    store.subscribe(saveDesiredStateToSessionStorage);
  }

  const appRootDOMNode = document.getElementById(rootId);
  const isRehydrating = appRootDOMNode.getAttribute('data-isRehydrating');

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
      <Provider store={store}>
        <AnalyticsHoC>
          <Router history={history} basename="/about-cancer/treatment/clinical-trials/search">
            <App services={services} zipConversionEndpoint={zipConversionEndpoint} />
          </Router>
        </AnalyticsHoC>
      </Provider>
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
