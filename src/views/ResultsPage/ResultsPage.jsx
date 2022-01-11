import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
import {
	updateFormField,
	updateFormSearchCriteria,
	clearForm,
	receiveData,
} from '../../store/actions';
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
import { useModal, useStoreToFindTrials } from '../../hooks';
import ResultsPageHeader from './ResultsPageHeader';
import ResultsList from './ResultsList';
import PrintModalContent from './PrintModalContent';
import { useAppSettings } from '../../store/store.js';

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
	const location = useLocation();
	const navigate = useNavigate();
	const [selectAll, setSelectAll] = useState(false);
	const [pagerPage, setPagerPage] = useState(0);

	const [pageIsLoading, setPageIsLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [trialResults, setTrialResults] = useState([]);
	const [resultsCount, setResultsCount] = useState(0);
	const [error, setError] = useState([]);
	const [isPageLoadReady, setIsPageLoadReady] = useState(false);
	// This is the only used to derive formType when zip is invalid,
	// when the form store is removed this will be removed
	const [searchCriteriaObject, setSearchCriteriaObject] = useState();
	const { resultsPage } = useSelector((store) => store.form);
	const cache = useSelector((store) => store.cache);
	const qs = queryString.extract(location.search);
	const [currCacheKey, setCurrCacheKey] = useState('');
	const [{ fetchTrials }] = useStoreToFindTrials();
	const [selectedResults, setSelectedResults] = useState(
		cache['selectedTrialsForPrint'] || []
	);
	const tracking = useTracking();

	const handleUpdate = (field, value) => {
		dispatch(
			updateFormField({
				field,
				value,
			})
		);
	};

	const handleTracking = (analyticsPayload) => {
		tracking.trackEvent(analyticsPayload);
	};

	// This all needs to be reconciled once new fetching is implemented
	// One loading state to rule them all
	const isAllFetchingComplete = () => {
		const isFetchingComplete =
			!isLoading && isPageLoadReady && !pageIsLoading && searchCriteriaObject;
		return isFetchingComplete;
	};

	// scroll to top on mount
	useEffect(() => {
		window.scrollTo(0, 0);
		if (isAllFetchingComplete()) {
			initData();
		} else if (!searchCriteriaObject) {
			// Get search criteria object
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
				setSearchCriteriaObject(res.searchCriteria);
				if (res.errors.length) {
					setError(res.errors);
				} else {
					dispatch(updateFormSearchCriteria(res.searchCriteria));
					setCurrCacheKey(qs);
					fetchTrials(qs);
				}
			});
		} else {
			// Something went wrong
			setPageIsLoading(false);
			setIsLoading(false);
		}
	}, []);

	// When trial results come in, open up shop
	useEffect(() => {
		if (isLoading && cache[currCacheKey] && cache[currCacheKey].total >= 0) {
			initData();
		}
	}, [cache[currCacheKey]]);

	useEffect(() => {
		// This should also be dependent on the current route/url
		if (isAllFetchingComplete()) {
			const formData = formToTrackingData(searchCriteriaObject);

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
				numResults: resultsCount,
				formData: formData,
				helperFormData: formDataConverter(
					searchCriteriaObject.formType,
					formData
				),
			});
			// Since we can page we need to prep isPageLoadReady
			setIsPageLoadReady(false);
		}
	}, [isPageLoadReady, pageIsLoading, searchCriteriaObject]);

	//track usage of selected results for print
	useEffect(() => {
		// update cacheStore with new selectedResults Value
		dispatch(receiveData('selectedTrialsForPrint', [...selectedResults]));
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

	const initData = () => {
		window.scrollTo(0, 0);
		//We are changing the results page, so
		//queue up another load.
		setSelectAll(false);
		setPageIsLoading(false);
		setIsLoading(false);
		setTrialResults(cache[currCacheKey]);
		setResultsCount(cache[currCacheKey].total);
		setIsPageLoadReady(true);
	};

	const handleSelectAll = () => {
		const pageResultIds = [
			...new Set(
				trialResults.trials.map((item) => {
					let resItem = {
						id: item.nciID,
						fromPage: searchCriteriaObject.resultsPage + 1,
					};
					return resItem;
				})
			),
		];

		let simpleIds = pageResultIds.map(({ id }) => id);

		if (!selectAll) {
			setSelectAll(true);
			setSelectedResults([...new Set([...selectedResults, ...pageResultIds])]);
		} else {
			setSelectAll(false);
			setSelectedResults(
				selectedResults.filter((item) => !simpleIds.includes(item.id))
			);
		}
	};

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
		if (currentPage !== pagerPage) {
			setIsLoading(true);
			// set currentPage and kick off fetch
			setPagerPage(currentPage);
			handleUpdate('resultsPage', currentPage);

			// update qs
			const parsed = queryString.parse(location.search);
			parsed.pn = currentPage + 1;
			const newqs = queryString.stringify(parsed, { arrayFormat: 'none' });
			setCurrCacheKey(newqs);
			// Navigation below is relative, hence use of just the parameters in this case
			navigate(`?${newqs}`);
			fetchTrials(newqs);
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
				{isLoading || resultsCount > 0 ? (
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
									{trialResults && trialResults.total > 1 && (
										<Pager
											data={trialResults.trials}
											callback={handlePagination}
											startFromPage={resultsPage}
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
						{isLoading ? (
							<div className="loader__pageheader"></div>
						) : (
							<ResultsPageHeader
								resultsCount={resultsCount}
								pageNum={resultsPage}
								onModifySearchClick={handleRefineSearch}
								onStartOverClick={handleStartOver}
								searchCriteriaObject={searchCriteriaObject}
							/>
						)}

						<div className="results-page__content">
							{renderControls()}
							<div className="results-page__list">
								{isLoading ? (
									<>{renderResultsListLoader()}</>
								) : trialResults && trialResults.total === 0 ? (
									<>{renderNoResults()}</>
								) : (
									<ResultsList
										queryParams={currCacheKey}
										results={trialResults.trials}
										selectedResults={selectedResults}
										setSelectedResults={setSelectedResults}
										setSelectAll={setSelectAll}
										tracking={handleTracking}
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
			<Modal isShowing={isShowing} hide={toggleModal}>
				<PrintModalContent
					selectedList={selectedResults}
					searchCriteriaObject={searchCriteriaObject}
				/>
			</Modal>
		</>
	);
};

export default ResultsPage;
