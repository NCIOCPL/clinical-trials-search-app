import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import './styles/main.scss';

import { BasicSearchPage, AdvancedSearchPage } from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';
import ErrorPage from './views/ErrorPage';
import { useAppSettings } from './store/store.js';
import { useAppInitializer } from './hooks';
require('es6-promise').polyfill();

const App = ({ services, zipConversionEndpoint }) => {
	const [{ appHasBeenInitialized, initErrorsList }] = useAppSettings();

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
App.propTypes = {
	services: PropTypes.object,
	zipConversionEndpoint: PropTypes.string,
};
export default App;
