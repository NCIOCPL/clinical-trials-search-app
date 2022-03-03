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
import { PrintContextProvider } from './store/printContext';
import { useAppInitializer } from './hooks';
//import Layout from './views/Layout';
import { useAppPaths } from './hooks';

require('es6-promise').polyfill();

const App = ({ services, zipConversionEndpoint }) => {
	const [{ appHasBeenInitialized, initErrorsList }] = useAppSettings();

	const ctsapiclient = services.ctsSearch();

	useAppInitializer(ctsapiclient, zipConversionEndpoint);

	const {
		BasicSearchPagePath,
		ResultsPagePath,
		TrialDescriptionPagePath,
		AdvancedSearchPagePath,
	} = useAppPaths();

	return (
		<>
			{!appHasBeenInitialized ? (
				// Is initializing, show loading screen.
				<></>
			) : initErrorsList.length === 0 ? (
				<>
					<Routes>
						<Route
							path={ResultsPagePath()}
							element={
								<PrintContextProvider>
									<ResultsPage />
								</PrintContextProvider>
							}
						/>
						<Route
							path={TrialDescriptionPagePath()}
							element={<TrialDescriptionPage />}
						/>
						<Route
							path={AdvancedSearchPagePath()}
							element={
								<PrintContextProvider>
									<AdvancedSearchPage />
								</PrintContextProvider>
							}
						/>
						<Route
							path={BasicSearchPagePath()}
							element={
								<PrintContextProvider>
									<BasicSearchPage />
								</PrintContextProvider>
							}
						/>
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
