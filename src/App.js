import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';

import './styles/main.scss';

import { BasicSearchPage, AdvancedSearchPage } from './views/SearchPage';
import ResultsPage from './views/ResultsPage';
import TrialDescriptionPage from './views/TrialDescriptionPage';
import ErrorPage from './views/ErrorPage';
import { useAppSettings } from './store/store.js';
import { useAppInitializer } from './hooks';
import Layout from './views/Layout';

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
					<Routes>
						<Route
							path="/about-cancer/treatment/clinical-trials/search"
							element={<Layout />}>
							<Route index element={<BasicSearchPage />} />
							<Route path="r" element={<ResultsPage />} />
							<Route path="v" element={<TrialDescriptionPage />} />
							<Route path="advanced" element={<AdvancedSearchPage />} />
						</Route>
					</Routes>
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
