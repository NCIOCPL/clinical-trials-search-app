import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import './styles/main.scss';

import {BasicSearchPage, AdvancedSearchPage} from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';
import ErrorPage from './views/ErrorPage';

import { useAppInitializer } from './hooks';
require('es6-promise').polyfill();

const App = ({ services, zipConversionEndpoint }) => {

  const appHasBeenInitialized = useSelector(
    store => store.globals.appHasBeenInitialized
  );

  const initErrorsList = useSelector(store => store.globals.initErrorsList);

  const ctsapiclient = services.ctsSearch();

  useAppInitializer(ctsapiclient, zipConversionEndpoint);

  return (
    <>
      {!appHasBeenInitialized ? (
        // Is initializaing, show loading screen.
        <></>
      ) : initErrorsList.length === 0 ? (
        <>
          <Switch>
            <Route
              path="/about-cancer/treatment/clinical-trials/search/r"
              component={ResultsPage}
            />
            <Route
              path="/about-cancer/treatment/clinical-trials/search/v"
              component={TrialDescriptionPage}
            />
            <Route
              exact
              path="/about-cancer/treatment/clinical-trials/search/advanced"
              component={AdvancedSearchPage}
            />
            <Route
              path="/about-cancer/treatment/clinical-trials/search/"
              component={BasicSearchPage}
            />
          </Switch>
        </>
      ) : (
        <ErrorPage initErrorsList={initErrorsList} />
      )}
    </>
  );
};

export default App;
