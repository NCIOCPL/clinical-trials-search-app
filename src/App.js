import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './styles/main.scss';

import SearchPage from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';

const App = () => {
  const appHasBeenVisited = useSelector(
    store => store.globals.appHasBeenVisited
  );
  
  return (
    <Fragment>
      <Switch>
        <Route path="/about-cancer/treatment/clinical-trials/search/r" component={ResultsPage} />
        <Route path="/about-cancer/treatment/clinical-trials/search/v" component={TrialDescriptionPage} />
        <Route
          exact
          path="/about-cancer/treatment/clinical-trials/search/advanced"
          render={() => <SearchPage formInit="advanced" />}
        />
        <Route path="/about-cancer/treatment/clinical-trials/search/" component={SearchPage} />
      </Switch>
    </Fragment>
  );
};

export default App;
