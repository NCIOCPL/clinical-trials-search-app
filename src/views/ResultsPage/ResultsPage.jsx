import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
import { updateFormSearchCriteria, clearForm } from '../../store/actions';
import {
	ChatOpener,
	Delighter,
	Checkbox,
	Modal,
	Pager,
} from '../../components/atomic';
import { TRY_NEW_SEARCH_LINK } from '../../constants';
import ErrorPage from '../ErrorPage';
import {
	formDataConverter,
	formToTrackingData,
	queryStringToSearchCriteria,
	runQueryFetchers,
} from '../../utilities';
import { convertObjectToBase64 } from '../../utilities/objects';
import { useModal } from '../../hooks';
import ResultsPageHeader from './ResultsPageHeader';
import ResultsList from './ResultsList';
import PrintModalContent from './PrintModalContent';
import { useAppSettings } from '../../store/store.js';
import { usePrintContext } from '../../store/printContext';

import {
	resultsPageReducer,
	setSuccessfulFetch,
	setSelectAll,
	setFetchActions,
	setSearchCriteriaObject,
} from './resultsPageReducer';

import { useCtsApi } from '../../hooks/ctsApiSupport';
import { getClinicalTrialsAction } from '../../services/api/actions';
import { formatTrialSearchQuery } from '../../utilities/formatTrialSearchQuery';
const queryString = require('query-string');

const ResultsPage = () => {
	// Load our React context
	const [
		{
			analyticsName,
			canonicalHost,
			siteName,
			zipConversionEndpoint,
			apiClients: { clinicalTrialsSearchClientV2 },
		},
	] = useAppSettings();

	// Redux
	const dispatch = useDispatch();

	// This is tightly coupled to the PageHeader.
	// SCO.resultsPage is undefined on initialRender
	// const { resultsPage } = useSelector((store) => store.form);
	// Route Data/ Management
	const location = useLocation();
	const navigate = useNavigate();
	const qs = queryString.extract(location.search);

	// Initial Page state. Used as the initial state in the reducer.
	const INITIAL_PAGE_STATE = {
		selectAll: false,
		pageIsLoading: true,
		isLoading: true,
		isPageLoadReady: false,
		pageErrors: [],
		searchCriteriaObject: null,
		trialResults: null,
		actionsHash: '',
		fetchActions: [],
		error: [],
		pagerPage: 0,
	};

	const [pageState, ctsDispatch] = useReducer(
		resultsPageReducer,
		INITIAL_PAGE_STATE
	);

	const {
		pageIsLoading,
		isLoading,
		isPageLoadReady,
		error,
		selectAll,
		trialResults,
		searchCriteriaObject,
		fetchActions,
		pagerPage,
	} = pageState;

	const { selectedResults, setSelectedResults } = usePrintContext();

	// Analytics
	const tracking = useTracking();

	const handleTracking = (analyticsPayload) => {
		tracking.trackEvent(analyticsPayload);
	};

	const [currentActionsHash, setCurrentActionsHash] = useState('');

	// This all needs to be reconciled once new fetching is implemented
	// One loading state to rule them all
	const isAllFetchingComplete = () => {
		const isFetchingComplete =
			!isLoading &&
			isPageLoadReady &&
			!pageIsLoading &&
			searchCriteriaObject &&
			searchCriteriaObject.formType &&
			payload &&
			payload.length &&
			!loading;
		return isFetchingComplete;
	};

	const { loading, payload } = useCtsApi(fetchActions);

	// Initialize the searchCriteriaObject. If the location changes, re-initialize it.
	useEffect(() => {
		if (!searchCriteriaObject) {
			const searchCriteria = async () => {
				const { diseaseFetcher, interventionFetcher, zipFetcher } =
					await runQueryFetchers(
						clinicalTrialsSearchClientV2,
						zipConversionEndpoint
					);
				return await queryStringToSearchCriteria(
					qs,
					diseaseFetcher,
					interventionFetcher,
					zipFetcher
				);
			};
			searchCriteria().then((res) => {
				ctsDispatch(setSearchCriteriaObject(res.searchCriteria));

				// If we have an error bassed onthe qs / SCO paramaeters
				// set the error and do not proceed with fetching the trials.
				if (res.errors.length) {
					ctsDispatch({
						type: 'SET_PROP',
						prop: 'error',
						payload: res.errors,
					});
				} else {
					const requestFilters = formatTrialSearchQuery(res.searchCriteria);
					const searchAction = getClinicalTrialsAction({
						// 'from' is calculated from (res.searchCriteria.resultsPage * 10). BAD.
						// And only when resultsPage > 0,
						// otherwise it's null and gets set in the action from a default value. BAD.
						// If the 'pn'/resultsPage parameter is...reasonably.. set to  1 for the first results page,
						// instead of the 'null' it expects for some reason,
						// the offset gets out of whack. BAD. VERY BAD.
						// TODO:  queryStringToSearchCriteria should be updated to set a default value for the first page.
						from: requestFilters.from,
						requestFilters: requestFilters,
						size: 10,
					});

					ctsDispatch(setFetchActions(searchAction));

					// Get a hash of the actions so that we can check= if the response data's
					// 'originating hash' matches the current hash during render. Changes from
					// the same route with different data will trigger a re-render with the
					// old data before the spinner is displayed.
					setCurrentActionsHash(convertObjectToBase64(searchAction));
					// setScoHash(convertObjectToBase64(searchAction));
					// Redux
					dispatch(updateFormSearchCriteria(res.searchCriteria));
				}
			});
		} else {
			const requestFilters = formatTrialSearchQuery(searchCriteriaObject);
			const searchAction = getClinicalTrialsAction({
				// 'from' is calculated from (res.searchCriteria.resultsPage * 10). BAD.
				// And only when resultsPage > 0,
				// otherwise it's null and gets set in the action from a default value. BAD.
				// If the 'pn'/resultsPage parameter is...reasonably.. set to  1 for the first results page,
				// instead of the 'null' it expects for some reason,
				// the offset gets out of whack. BAD. VERY BAD.
				// TODO:  queryStringToSearchCriteria should be updated to set a default value for the first page.
				from: requestFilters.from,
				requestFilters: requestFilters,
			});

			ctsDispatch(setFetchActions(searchAction));

			// Get a hash of the actions so that we can check= if the response data's
			// 'originating hash' matches the current hash during render. Changes from
			// the same route with different data will trigger a re-render with the
			// old data before the spinner is displayed.
			setCurrentActionsHash(convertObjectToBase64(searchAction));
			// setScoHash(convertObjectToBase64(searchAction));
			// Redux
			dispatch(updateFormSearchCriteria(searchCriteriaObject));
		}
	}, [location]);

	// If we have a search criteria object and paylaod, we have a successful fetch.
	useEffect(() => {
		if (
			searchCriteriaObject &&
			searchCriteriaObject.formType &&
			payload &&
			payload.length > 0
		) {
			// We've received the data. Scroll up.
			// Store the data, and modify the loading states via the pageState reducer.
			window.scrollTo(0, 0);

			ctsDispatch({
				type: 'SET_PROP',
				prop: 'trialResults',
				payload: payload[0],
			});

			// At this point, the wrapped view is going to handle this request.
			ctsDispatch(setSuccessfulFetch(currentActionsHash, payload[0]));
		}
	}, [loading, payload, searchCriteriaObject]);

	//Handle Analytics
	useEffect(() => {
		// This should also be dependent on the current route/url
		if (isAllFetchingComplete()) {
			const trackingData = formToTrackingData(searchCriteriaObject);

			handleTracking({
				// These properties are required.
				type: 'PageLoad',
				event: `ClinicalTrialsSearchApp:Load:Results`,
				analyticsName,
				name: canonicalHost.replace('https://', '') + window.location.pathname,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				metaTitle: `Clinical Trials Search Results - ${siteName}`,
				title: `Clinical Trials Search Results`,
				status: 'success',
				formType: searchCriteriaObject.formType,
				numResults: trialResults.total,
				formData: trackingData,
				helperFormData: formDataConverter(
					searchCriteriaObject.formType,
					trackingData
				),
			});
			// Since we can page we need to prep isPageLoadReady
			ctsDispatch({
				type: 'SET_PROP',
				prop: 'isPageLoadReady',
				payload: false,
			});
		}
	}, [isPageLoadReady, pageIsLoading, searchCriteriaObject]);

	//track usage of selected results for print
	useEffect(() => {
		if (selectedResults.length > 100) {
			//max number of print selections made
			handleTracking({
				// These properties are required.
				type: 'Other',
				event: 'ClinicalTrialsSearchApp:Other:PrintSelectedError',
				analyticsName,
				linkName: 'CTSResultsSelectedErrorClick',
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				formType: searchCriteriaObject.formType,
				errorReason: 'maxselectionreached',
			});
			toggleModal();
		}
	}, [selectedResults]);

	const handleSelectAll = () => {
		const pageResultIds = [
			...new Set(
				trialResults.trials.map((item) => {
					let resItem = {
						id: item.nci_id,
						fromPage: searchCriteriaObject.resultsPage + 1,
					};
					return resItem;
				})
			),
		];

		let simpleIds = pageResultIds.map(({ id }) => id);

		if (!selectAll) {
			ctsDispatch({
				type: 'SET_PROP',
				prop: 'selectAll',
				payload: true,
			});
			setSelectedResults([...new Set([...selectedResults, ...pageResultIds])]);
		} else {
			ctsDispatch({
				type: 'SET_PROP',
				prop: 'selectAll',
				payload: false,
			});
			setSelectedResults(
				selectedResults.filter((item) => !simpleIds.includes(item.id))
			);
		}
	};

	// TODO: Uses Redux
	const handleStartOver = (linkType) => {
		handleTracking({
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:NewSearchLinkClick',
			analyticsName,
			linkName: 'CTStartOverClick',
			formType: searchCriteriaObject.formType,
			source: linkType,
		});
		dispatch(clearForm());
	};

	const handleRefineSearch = () => {
		handleTracking({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ModifySearchCriteriaLinkClick',
			analyticsName,
			linkName: 'CTSModifyClick',
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			formType: searchCriteriaObject.formType,
			source: 'modify_search_criteria_link',
		});
		navigate('/about-cancer/treatment/clinical-trials/search/advanced', {
			state: {
				criteria: searchCriteriaObject,
				refineSearch: true,
			},
		});
	};

	// setup print Modal
	const { isShowing, toggleModal } = useModal();
	const printSelectedBtn = useRef(null);

	const handlePagination = (currentPage) => {
		if (currentPage != pagerPage) {
			ctsDispatch({
				type: 'SET_PROP',
				prop: 'isLoading',
				payload: true,
			});

			ctsDispatch({
				type: 'SET_PROP',
				prop: 'pagerPage',
				payload: currentPage,
			});

			ctsDispatch(
				setSearchCriteriaObject({
					...searchCriteriaObject,
					resultsPage: currentPage,
				})
			);

			const parsed = queryString.parse(location.search);
			parsed.pn = currentPage + 1;
			const newqs = queryString.stringify(parsed, { arrayFormat: 'none' });
			// Navigation below is relative, hence use of just the parameters in this case
			navigate(`?${newqs}`);
		}
	};
	const renderResultsListLoader = () => (
		<div className="loader__results-list-wrapper">
			<div className="loader__results-list">
				<div className="loader__results-list-title">
					<div></div>
					<div></div>
				</div>
				<div className="loader__results-list-labels">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			<div className="loader__results-list">
				<div className="loader__results-list-title">
					<div></div>
					<div></div>
				</div>
				<div className="loader__results-list-labels">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			<div className="loader__results-list">
				<div className="loader__results-list-title">
					<div></div>
					<div></div>
				</div>
				<div className="loader__results-list-labels">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
	);

	const renderDelighters = () => (
		<div className="cts-delighter-container">
			<Delighter
				classes="cts-livehelp"
				url="/contact"
				titleText={
					<>
						Have a question?
						<br />
						We&apos;re here to help
					</>
				}>
				<p>
					<strong>Chat with us:</strong> LiveHelp
					<br />
					<strong>Call us:</strong> 1-800-4-CANCER
					<br />
					(1-800-422-6237)
				</p>
			</Delighter>

			<Delighter
				classes="cts-which"
				url="/about-cancer/treatment/clinical-trials/search/trial-guide"
				titleText={<>Which trials are right for you?</>}>
				<p>
					Use the checklist in our guide to gather the information you’ll need.
				</p>
			</Delighter>
		</div>
	);

	const renderControls = (isBottom = false) => {
		const cbxId = isBottom ? 'select-all-cbx-bottom' : 'select-all-cbx-top';
		return (
			<>
				{isLoading || trialResults.total > 0 ? (
					<div
						className={`results-page__control ${
							isBottom ? '--bottom' : '--top'
						}`}>
						{!isLoading && trialResults.total !== 0 && (
							<>
								<div className="results-page__select-all">
									<Checkbox
										id={cbxId}
										name="select-all"
										label="Select all on page"
										checked={selectAll}
										classes="check-all"
										onChange={handleSelectAll}
									/>
									<button
										className="results-page__print-button"
										ref={printSelectedBtn}
										onClick={handlePrintSelected}
										data-pos={isBottom ? 'bottom' : 'top'}>
										Print Selected
									</button>
								</div>
								<div className="results-page__pager">
									{searchCriteriaObject &&
										trialResults &&
										trialResults.total > 1 && (
											<Pager
												data={trialResults.trials}
												callback={handlePagination}
												startFromPage={searchCriteriaObject.resultsPage}
												totalItems={trialResults.total}
											/>
										)}
								</div>
							</>
						)}
					</div>
				) : null}
			</>
		);
	};

	const handlePrintSelected = (e) => {
		const buttonPos = e.target.getAttribute('data-pos');

		//emit analytics
		if (selectedResults.length === 0) {
			handleTracking({
				type: 'Other',
				event: 'ClinicalTrialsSearchApp:Other:PrintSelectedError',
				analyticsName,
				linkName: 'CTSResultsSelectedErrorClick',
				formType: searchCriteriaObject.formType,
				errorReason: 'noneselected',
			});
		} else if (selectedResults.length >= 100) {
			handleTracking({
				type: 'Other',
				event: 'ClinicalTrialsSearchApp:Other:PrintMaxExceededClick',
				analyticsName,
				linkName: 'CTSResultsSelectedErrorClick',
				formType: searchCriteriaObject.formType,
				errorReason: 'maxselectionreached',
			});
		} else {
			handleTracking({
				type: 'Other',
				event: 'ClinicalTrialsSearchApp:Other:PrintSelectedButtonClick',
				analyticsName,
				linkName: 'CTSResultsPrintSelectedClick',
				formType: searchCriteriaObject.formType,
				buttonPos,
				selectAll,
				selectedCount: selectedResults.length,
				pagesWithSelected: [
					...new Set(selectedResults.map(({ fromPage }) => fromPage)),
				],
			});
		}

		toggleModal();
	};

	const renderInvalidZip = () => {
		return <ErrorPage initErrorsList={error} />;
	};

	const renderNoResults = () => {
		return (
			<div className="results-list no-results">
				<p>
					<strong>No clinical trials matched your search.</strong>
				</p>
				<div>
					For assistance, please contact the Cancer Information Service. You can{' '}
					<ChatOpener /> or call 1-800-4-CANCER (1-800-422-6237).
				</div>
				<p>
					<Link
						to={`${
							searchCriteriaObject.formType === 'basic'
								? '/about-cancer/treatment/clinical-trials/search'
								: '/about-cancer/treatment/clinical-trials/search/advanced'
						}`}
						onClick={() => handleStartOver(TRY_NEW_SEARCH_LINK)}>
						Try a new search
					</Link>
				</p>
			</div>
		);
	};

	return (
		<>
			<Helmet>
				<title>
					Clinical Trials Search Results - National Cancer Institute
				</title>
				<meta property="og:title" content="Clinical Trials Search Results" />
				<link
					rel="canonical"
					href={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?${qs}`}
				/>
				<meta
					property="og:url"
					content={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?${qs}`}
				/>
				<meta
					name="description"
					content="Find an NCI-supported clinical trial - Search results"
				/>
				<meta
					property="og:description"
					content="Find an NCI-supported clinical trial - Search results"
				/>
			</Helmet>
			<article className="results-page">
				<h1>Clinical Trials Search Results</h1>
				{error.length && error.filter((err) => err.fieldName === 'zip') ? (
					<>{renderInvalidZip()}</>
				) : (
					<>
						{isLoading || !searchCriteriaObject ? (
							<div className="loader__pageheader"></div>
						) : (
							<ResultsPageHeader
								resultsCount={trialResults.total}
								pageNum={searchCriteriaObject.resultsPage}
								onModifySearchClick={handleRefineSearch}
								onStartOverClick={handleStartOver}
								searchCriteriaObject={searchCriteriaObject}
							/>
						)}

						<div className="results-page__content">
							{renderControls()}
							<div className="results-page__list">
								{isLoading || !searchCriteriaObject ? (
									<>{renderResultsListLoader()}</>
								) : trialResults && trialResults.total === 0 ? (
									<>{renderNoResults()}</>
								) : (
									<ResultsList
										results={trialResults.trials}
										selectedResults={selectedResults}
										setSelectedResults={setSelectedResults}
										setSelectAll={(value) => {
											ctsDispatch(setSelectAll(value));
										}}
										tracking={handleTracking}
										searchCriteriaObject={searchCriteriaObject}
									/>
								)}

								<aside className="results-page__aside --side">
									{renderDelighters()}
								</aside>
							</div>
							{renderControls(true)}
						</div>
					</>
				)}

				<aside className="results-page__aside --bottom">
					{renderDelighters()}
				</aside>
			</article>
			{searchCriteriaObject && (
				<Modal isShowing={isShowing} hide={toggleModal}>
					<PrintModalContent
						selectedList={selectedResults}
						searchCriteriaObject={searchCriteriaObject}
					/>
				</Modal>
			)}
		</>
	);
};

export default ResultsPage;
