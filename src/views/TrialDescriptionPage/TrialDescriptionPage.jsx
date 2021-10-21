import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTracking } from 'react-tracking';

import {
	Accordion,
	AccordionItem,
	Delighter,
	TrialStatusIndicator,
	SearchCriteriaTable,
} from '../../components/atomic';
import SitesList from './SitesList';
import { clearForm, getTrial } from '../../store/actions';
import { useAppSettings } from '../../store/store.js';

import './TrialDescriptionPage.scss';

const queryString = require('query-string');

const TrialDescriptionPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [isTrialLoading, setIsTrialLoading] = useState(true);
	const [qs] = useState(location.search);
	const [isPageLoadReady, setIsPageLoadReady] = useState(false);
	const { isDirty, formType } = useSelector((store) => store.form);
	const parsed = queryString.parse(qs);
	const currId = parsed.id;
	const [storeRehydrated] = useState(false);

	const trialTitle = useSelector((store) => store.cache.currentTrialTitle);
	const cacheSnap = useSelector((store) => store.cache);
	const tracking = useTracking();

	const [searchUsed] = useState(Object.keys(cacheSnap).length > 1);

	const trial = useSelector((store) => store.cache[currId]);
	const [{ analyticsName, canonicalHost }] = useAppSettings();

	// enum for empty location checks
	const noLocInfo = ['not yet active', 'in review', 'approved'];

	useEffect(() => {
		if (trial) {
			initTrialData();
		}
	}, [trial]);

	useEffect(() => {
		if (storeRehydrated) {
			dispatch(getTrial({ trialId: currId }));
		}
	}, [storeRehydrated]);

	// scroll to top on mount
	useEffect(() => {
		window.scrollTo(0, 0);
		if (trial && trial.briefTitle) {
			initTrialData();
		} else {
			dispatch(getTrial({ trialId: currId }));
		}
	}, []);

	useEffect(() => {
		if (isPageLoadReady) {
			tracking.trackEvent({
				// These properties are required.
				type: 'PageLoad',
				event: `ClinicalTrialsSearchApp:Load:TrialDescription`,
				analyticsName,
				name: canonicalHost.replace('https://', '') + window.location.pathname,
				title: `${trial.briefTitle}`,
				metaTitle: `${trial.briefTitle}`,
				// Any additional properties fall into the "page.additionalDetails" bucket
				// for the event.
				formType: formType,
				nctId: trial.nctID,
			});
		}
	}, [isPageLoadReady]);

	const initTrialData = () => {
		setIsTrialLoading(false);
		setIsPageLoadReady(true);
	};

	const handleStartOver = () => {
		dispatch(clearForm());
	};

	const trackShare = (shareType) => ({
		type: 'Other',
		event: `ClinicalTrialsSearchApp:Other:ShareButton`,
		analyticsName,
		linkName: 'UnknownLinkName',
		formType: formType,
		shareType: shareType.toLowerCase(),
	});

	const handlePrintTrial = () => {
		tracking.trackEvent(trackShare('Print'));
		window.print();
	};

	const handleEmailTrial = () => {
		tracking.trackEvent(trackShare('Email'));
		window.location.href = `mailto:?subject=Information%20from%20the%20National%20Cancer%20Institute%20Web%20Site&body=I%20found%20this%20information%20on%20www.cancer.gov%20and%20I'd%20like%20to%20share%20it%20with%20you:%20https%3A%2F%2Fwww.cancer.gov%2Fabout-cancer%2Ftreatment%2Fclinical-trials%2Fsearch%2Fv%3Fid%3D${currId}%0A%0A%20NCI's%20Web%20site,%20www.cancer.gov,%20provides%20accurate,%20up-to-date,%20comprehensive%20cancer%20information%20from%20the%20U.S.%20government's%20principal%20agency%20for%20cancer%20research.%20If%20you%20have%20questions%20or%20need%20additional%20information,%20we%20invite%20you%20to%20contact%20NCI%E2%80%99s%20LiveHelp%20instant%20messaging%20service%20at%20https://livehelp.cancer.gov,%20or%20call%20the%20NCI's%20Contact%20Center%201-800-4-CANCER%20(1-800-422-6237)%20(toll-free%20from%20the%20United%20States).`;
	};

	const renderDelighters = () => {
		return (
			<>
				<div className="delighter cts-share">
					<div className="share-text">
						Share this clinical trial with your doctor:
					</div>
					<div className="share-btn-container">
						<button
							className="share-btn cts-share-print"
							type="button"
							onClick={handlePrintTrial}>
							<span className="icon icon-print" aria-hidden="true"></span>
							Print
							<span className="show-for-sr"> this trial</span>
						</button>
						<button
							className="share-btn cts-share-email"
							type="button"
							onClick={handleEmailTrial}>
							<span className="icon icon-email" aria-hidden="true"></span>
							Email <span className="show-for-sr">this trial</span>
						</button>
					</div>
				</div>
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
							Use the checklist in our guide to gather the information you’ll
							need.
						</p>
					</Delighter>
				</div>
			</>
		);
	};

	const renderTrialDescriptionHeader = () => {
		return (
			<div className="trial-description-page__header">
				{(isDirty || searchUsed) && (
					<div className="back-to-search btnAsLink">
						<span
							onClick={() => navigate(-1)}
							onKeyDown={() => navigate(-1)}
							tabIndex="0"
							role="button">
							&lt; Back to search results
						</span>
					</div>
				)}
				<SearchCriteriaTable handleReset={handleStartOver} placement="trial" />
			</div>
		);
	};

	const renderEligibilityCriteria = () => {
		const eligibilityArr = trial.eligibilityInfo.unstructuredCriteria;
		const inclusionArr = eligibilityArr.filter(
			(item) => item.isInclusionCriterion
		);
		const exclusionArr = eligibilityArr.filter(
			(item) => !item.isInclusionCriterion
		);
		return (
			<div className="eligibility-criteria">
				<h3>Inclusion Criteria</h3>
				<ul>
					{inclusionArr.map((item, idx) => (
						<li key={'inclusion-' + idx}>{item.description}</li>
					))}
				</ul>
				{exclusionArr.length > 0 && (
					<>
						<h3>Exclusion Criteria</h3>
						<ul>
							{exclusionArr.map((item, idx) => (
								<li key={'exclusion-' + idx}>{item.description}</li>
							))}
						</ul>
					</>
				)}
			</div>
		);
	};

	const renderSecondaryIDs = () => {
		let secArr = [];
		const secIDFields = ['nciID', 'ccrID', 'ctepID', 'dcpID', 'otherTrialIDs'];
		// push secondaries onto array
		secIDFields.forEach((idField) => {
			if (idField === 'otherTrialIDs') {
				if (trial.otherTrialIDs && trial.otherTrialIDs.length > 0) {
					trial.otherTrialIDs.forEach((item) => {
						secArr.push(item.value);
					});
				}
			} else {
				let id = trial[idField];
				if (id && id !== '') {
					secArr.push(id);
				}
			}
		});
		//de-dupe
		secArr = [...new Set(secArr)];
		// filter out nct and protocol id
		secArr = secArr.filter(
			(item) => item !== trial.nctID && item !== trial.protocolID
		);

		return secArr.length > 0 ? (
			<li>
				<strong className="field-label">Secondary IDs</strong>
				{secArr.join(', ')}
			</li>
		) : (
			<></>
		);
	};

	const prettifyDescription = () => {
		let formattedStr =
			'<p>' + trial.detailedDescription.replace(/(\r\n)/gm, '</p><p>') + '</p>';
		return { __html: formattedStr };
	};

	const handleExpandAllSections = () => {
		let headings = document.querySelectorAll(
			'.trial-description-page__content h2.cts-accordion__heading'
		);
		let buttons = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__button'
		);
		let contents = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__content'
		);
		headings.forEach((item) => {
			item.setAttribute('aria-expanded', true);
		});
		buttons.forEach((item) => {
			item.setAttribute('aria-expanded', true);
		});
		contents.forEach((item) => {
			item.setAttribute('aria-hidden', false);
		});
	};

	const handleHideAllSections = () => {
		let headings = document.querySelectorAll(
			'.trial-description-page__content h2.cts-accordion__heading'
		);
		let buttons = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__button'
		);
		let contents = document.querySelectorAll(
			'.trial-description-page__content .cts-accordion__content'
		);
		headings.forEach((item) => {
			item.setAttribute('aria-expanded', false);
		});
		buttons.forEach((item) => {
			item.setAttribute('aria-expanded', false);
		});
		contents.forEach((item) => {
			item.setAttribute('aria-hidden', true);
		});
	};

	return (
		<>
			{!isTrialLoading && (
				<Helmet>
					<title>{trial.briefTitle}</title>
					<meta property="og:title" content={trial.briefTitle} />
					<link
						rel="canonical"
						href={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=${currId}`}
					/>
					<meta
						property="og:url"
						content={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=${currId}`}
					/>
					<meta name="description" content={trial.briefTitle} />
					<meta
						property="og:description"
						content={`${trial.briefTitle} - ${trial.nctID}`}
					/>
				</Helmet>
			)}
			<article className="trial-description-page">
				{isTrialLoading ? (
					trialTitle ? (
						<h1>{trialTitle}</h1>
					) : (
						<div className="loader__trial-title">
							<div className="skeleton"></div>
							<div className="skeleton"></div>
						</div>
					)
				) : (
					<h1>{trial.briefTitle}</h1>
				)}
				{formType === 'basic' || formType === 'advanced' ? (
					renderTrialDescriptionHeader()
				) : (
					<></>
				)}
				<div className="trial-description-page__description">
					<div className="trial-description-page__content">
						{isTrialLoading ? (
							<>
								<div className="loader__mock-accordion">
									<div></div>
									<div className="loader__mock-description">
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</>
						) : (
							<>
								<div className="trial-content-header">
									<TrialStatusIndicator
										status={trial.currentTrialStatus.toLowerCase()}
									/>
									<div className="accordion-control__wrapper">
										<button
											type="button"
											className="accordion-control__button open"
											onClick={handleExpandAllSections}>
											<span className="icon expand"></span> Open all{' '}
											<span className="show-for-sr">sections</span>
										</button>
										<button
											type="button"
											className="accordion-control__button close"
											onClick={handleHideAllSections}>
											<span className="icon contract"></span> Close all{' '}
											<span className="show-for-sr">sections</span>
										</button>
									</div>
								</div>

								<Accordion>
									<AccordionItem titleCollapsed="Description" expanded>
										<p>{trial.briefSummary}</p>
									</AccordionItem>
									<AccordionItem titleCollapsed="Eligibility Criteria">
										{renderEligibilityCriteria()}
									</AccordionItem>
									<AccordionItem titleCollapsed="Locations &amp; Contacts">
										{trial.sites && trial.sites.length > 0 ? (
											<SitesList sites={trial.sites} />
										) : noLocInfo.includes(
												trial.currentTrialStatus.toLowerCase()
										  ) ? (
											<p>Location information is not yet available.</p>
										) : (
											<p>
												See trial information on{' '}
												<a
													href={`https://www.clinicaltrials.gov/show/${trial.nctID}`}
													target="_blank"
													rel="noopener noreferrer">
													ClinicalTrials.gov
												</a>{' '}
												for a list of participating sites.
											</p>
										)}
									</AccordionItem>
									<AccordionItem titleCollapsed="Trial Objectives and Outline">
										{trial.detailedDescription && (
											<div
												className="trial-objectives-outline"
												dangerouslySetInnerHTML={prettifyDescription()}
											/>
										)}
									</AccordionItem>
									<AccordionItem titleCollapsed="Trial Phase &amp; Type">
										<>
											<p className="trial-phase">
												<strong className="field-label">Trial Phase</strong>
												{`${
													trial.trialPhase.phaseNumber &&
													trial.trialPhase.phaseNumber !== 'NA'
														? 'Phase ' +
														  trial.trialPhase.phaseNumber.replace('_', '/')
														: 'No phase specified'
												}`}
											</p>
											{trial.primaryPurpose.code &&
												trial.primaryPurpose.code !== '' && (
													<p className="trial-type">
														<strong className="field-label">Trial Type</strong>
														<span className="trial-type-name">
															{trial.primaryPurpose.code.toLowerCase() ===
															'other'
																? trial.primaryPurpose.otherText
																: trial.primaryPurpose.code
																		.toLowerCase()
																		.replace(/_/g, ' ')}
														</span>
													</p>
												)}
										</>
									</AccordionItem>
									{(trial.leadOrganizationName ||
										trial.principalInvestigator) && (
										<AccordionItem titleCollapsed="Lead Organization">
											<>
												{trial.leadOrganizationName &&
													trial.leadOrganizationName !== '' && (
														<p className="leadOrg">
															<strong className="field-label">
																Lead Organization
															</strong>
															{trial.leadOrganizationName}
														</p>
													)}
												{trial.principalInvestigator &&
													trial.principalInvestigator !== '' && (
														<p className="investigator">
															<strong className="field-label">
																Principal Investigator
															</strong>
															{trial.principalInvestigator}
														</p>
													)}
											</>
										</AccordionItem>
									)}
									<AccordionItem titleCollapsed="Trial IDs">
										<ul className="trial-ids">
											<li>
												<strong className="field-label">Primary ID</strong>
												{trial.protocolID}
											</li>
											{renderSecondaryIDs()}
											<li>
												<strong className="field-label">
													ClinicalTrials.gov ID
												</strong>
												<a
													href={`http://clinicaltrials.gov/show/${trial.nctID}`}
													target="_blank"
													rel="noopener noreferrer">
													{trial.nctID}
												</a>
											</li>
										</ul>
									</AccordionItem>
								</Accordion>
							</>
						)}
					</div>

					<div className="trial-description-page__aside">
						{renderDelighters()}
					</div>
				</div>
			</article>
		</>
	);
};
TrialDescriptionPage.propTypes = {
	location: PropTypes.object,
};
export default TrialDescriptionPage;
