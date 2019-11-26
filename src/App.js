import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import './styles/main.scss';

import SearchPage from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';

function App() {
  return (
    <Fragment>
      <Switch>
        <Route path="/r" component={ResultsPage}/>
        <Route path="/v" component={TrialDescriptionPage} />
        <Route exact path="/advanced" render={() => <SearchPage formInit="advanced" />} />
        <Route path="/" component={SearchPage} />
      </Switch>
    </Fragment>
  );
}

export default App;
