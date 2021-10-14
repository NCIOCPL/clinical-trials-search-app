import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';

import { SearchCriteriaTable } from '../../components/atomic';
import { START_OVER_LINK } from '../../constants';
import { history } from '../../services/history.service';
import { getMainType } from '../../store/actions';
import { useAppSettings } from '../../store/store.js';

const ResultsPageHeader = ({
	handleUpdate,
	handleReset,
	resultsCount,
	pageNum,
	step = 10,
}) => {
	const dispatch = useDispatch();
	const { formType, cancerType, age, zip, keywordPhrases, isDirty } =
		useSelector((store) => store.form);
	const tracking = useTracking();
	const [{ analyticsName }] = useAppSettings();
	const { maintypeOptions } = useSelector((store) => store.cache);

	const handleRefineSearch = () => {
		if (formType === 'basic') {
			//prefetch stuff
			if (!maintypeOptions || maintypeOptions.length < 1) {
				dispatch(getMainType({}));
			}
			if (cancerType.name !== '') {
				handleUpdate('cancerTypeModified', true);
			}
			if (age !== '') {
				handleUpdate('ageModified', true);
			}
			if (zip !== '') {
				handleUpdate('zipModified', true);
			}
			if (keywordPhrases !== '') {
				handleUpdate('keywordPhrasesModified', true);
			}
			handleUpdate('formType', 'advanced');
		}

		handleUpdate('refineSearch', true);
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ModifySearchCriteriaLinkClick',
			analyticsName,
			linkName: 'CTSModifyClick',
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			formType,
			source: 'modify_search_criteria_link',
		});
		history.push('/about-cancer/treatment/clinical-trials/search/advanced');
	};

	return (
		<div className="cts-results-header">
			{resultsCount === 0 ? (
				<div className="no-trials-found">
					<strong>No clinical trials matched your search.</strong>
				</div>
			) : (
				<div className="all-trials">
					<strong>
						Results{' '}
						{`${pageNum * step + 1}-${
							resultsCount <= step * (pageNum + 1)
								? resultsCount
								: step * (pageNum + 1)
						} `}{' '}
						of {resultsCount} for your search{' '}
						{!isDirty ? (
							<>
								for: &quot;all trials&quot; &nbsp; | &nbsp;
								<Link
									to={`${
										formType === 'basic'
											? '/about-cancer/treatment/clinical-trials/search'
											: '/about-cancer/treatment/clinical-trials/search/advanced'
									}`}
									onClick={() => handleReset(START_OVER_LINK)}>
									Start Over
								</Link>
							</>
						) : (
							''
						)}
					</strong>
				</div>
			)}
			<SearchCriteriaTable
				handleRefine={handleRefineSearch}
				handleReset={handleReset}
			/>
		</div>
	);
};
ResultsPageHeader.propTypes = {
	handleUpdate: PropTypes.func,
	handleReset: PropTypes.func,
	resultsCount: PropTypes.number,
	pageNum: PropTypes.number,
	step: PropTypes.number,
};
export default ResultsPageHeader;
