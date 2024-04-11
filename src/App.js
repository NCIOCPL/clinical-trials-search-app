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
//import PageNotFound from './views/ErrorBoundary/PageNotFound.jsx';
import { ErrorBoundary } from './views/ErrorBoundary/index.jsx';
import { useAppSettings } from './store/store.js';
import { PrintContextProvider } from './store/printContext';
import { useAppInitializer } from './hooks';
import { useAppPaths } from './hooks';
//import { ErrorsOccurredPage } from './views/ErrorBoundary/index.jsx';

require('es6-promise').polyfill();

const App = ({ zipConversionEndpoint }) => {
	const [{ appHasBeenInitialized, initErrorsList }] = useAppSettings();

	useAppInitializer(zipConversionEndpoint);

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
				<PrintContextProvider>
					<Routes>
						<Route path={ResultsPagePath()} element={<ResultsPage />} />
						<Route
							path={TrialDescriptionPagePath()}
							element={<TrialDescriptionPage />}
						/>
						<Route
							path={AdvancedSearchPagePath()}
							element={<AdvancedSearchPage />}
						/>
						<Route path={BasicSearchPagePath()} element={<BasicSearchPage />} />
						<Route path="/*" element={<ErrorBoundary />} />
					</Routes>
				</PrintContextProvider>
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
