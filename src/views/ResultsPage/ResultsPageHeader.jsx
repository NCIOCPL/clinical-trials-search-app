import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SearchCriteriaTableUpdated } from '../../components/atomic';
import { START_OVER_LINK } from '../../constants';

import { hasSCOBeenUpdated } from '../../utilities';
import { useAppPaths } from '../../hooks/routing';

const ResultsPageHeader = ({
	onModifySearchClick,
	onStartOverClick,
	resultsCount,
	pageNum,
	step = 10,
	searchCriteriaObject,
}) => {
	const { BasicSearchPagePath, AdvancedSearchPagePath } = useAppPaths();

	const renderStartOver = (searchCriteriaObject) => {
		return (
			<Link
				to={`${
					searchCriteriaObject?.formType === 'basic'
						? BasicSearchPagePath()
						: AdvancedSearchPagePath()
				}`}
				state={{ criteria: {}, refineSearch: false }}
				onClick={() => onStartOverClick(START_OVER_LINK)}>
				Start Over
			</Link>
		);
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
						{searchCriteriaObject && hasSCOBeenUpdated(searchCriteriaObject) && (
							<>
								for: &quot;all trials&quot; &nbsp; | &nbsp;
								{renderStartOver(searchCriteriaObject)}
							</>
						)}
					</strong>
				</div>
			)}
			{searchCriteriaObject && !hasSCOBeenUpdated(searchCriteriaObject) && (
				<>
					<SearchCriteriaTableUpdated
						searchCriteriaObject={searchCriteriaObject}
					/>
					<div className="reset-form">
						<Link
							to={`${
								searchCriteriaObject?.formType === 'basic'
									? BasicSearchPagePath()
									: AdvancedSearchPagePath()
							}`}
							state={{ criteria: {}, refineSearch: false }}
							onClick={() => onStartOverClick(START_OVER_LINK)}>
							Start Over
						</Link>
						<span aria-hidden="true" className="separator">
							|
						</span>
						<button
							type="button"
							className="btnAsLink"
							onClick={onModifySearchClick}>
							Modify Search Criteria
						</button>
					</div>
				</>
			)}
		</div>
	);
};

ResultsPageHeader.propTypes = {
	onStartOverClick: PropTypes.func,
	onModifySearchClick: PropTypes.func,
	resultsCount: PropTypes.number,
	pageNum: PropTypes.number,
	step: PropTypes.number,
	searchCriteriaObject: PropTypes.object,
};
export default ResultsPageHeader;
