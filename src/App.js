import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './styles/main.scss';

import SearchPage from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';
import ErrorPage from './views/ErrorPage';

import { useAppInitializer } from './hooks';

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
        <Fragment>
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
              render={() => <SearchPage formInit="advanced" />}
            />
            <Route
              path="/about-cancer/treatment/clinical-trials/search/"
              component={SearchPage}
            />
          </Switch>
        </Fragment>
      ) : (
        <ErrorPage initErrorsList={initErrorsList} />
      )}
    </>
  );
};

export default App;
