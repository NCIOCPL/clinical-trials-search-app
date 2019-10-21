import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './styles/main.scss';

import SearchPage from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import ProtocolPage from './views/ProtocolPage';

import mockResults from './mocks/mock-results.json';

function App() {
  return (
    <Fragment>
      <Switch>
        <Redirect exact from="/" to="/search" />
        <Route path="/search" component={SearchPage} />
        <Route
          path="/r"
          render={() => <ResultsPage results={mockResults} />}
        />
        <Route path="/v" component={ProtocolPage} />
      </Switch>
    </Fragment>
  );
}

export default App;
