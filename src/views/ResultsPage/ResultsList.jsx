import React from 'react';
import PropTypes from 'prop-types';
import ResultsListItem from './ResultsListItem';
const ResultsList = ({
	results,
	selectedResults,
	setSelectedResults,
	setSelectAll,
	queryParams,
	searchCriteriaObject,
}) => {
	const { resultsPage, formType } = searchCriteriaObject;

	const handleOnCheckChange = (id) => {
		let resultItem = {
			id: id,
			fromPage: resultsPage + 1,
		};

		//if the new item does not already exist in the selected results, add it
		if (
			selectedResults.filter((item) => item.id === resultItem.id).length === 0
		) {
			setSelectedResults([...selectedResults, resultItem]);
		} else {
			// remove from selected
			setSelectAll(false);
			setSelectedResults(selectedResults.filter((item) => item.id !== id));
		}
	};

	return (
		<div className="results-list">
			{results.map((item, idx) => {
				return (
					<ResultsListItem
						queryParams={queryParams}
						key={item.nci_id}
						id={item.nci_id}
						item={item}
						itemIndex={idx}
						resultsPage={resultsPage}
						formType={formType}
						isChecked={
							selectedResults.find(({ id }) => id === item.nci_id) !== undefined
						}
						onCheckChange={handleOnCheckChange}
					/>
				);
			})}
		</div>
	);
};

ResultsList.propTypes = {
	searchCriteriaObject: PropTypes.object,
	setSelectedResults: PropTypes.func,
	selectedResults: PropTypes.array,
	results: PropTypes.array,
	setSelectAll: PropTypes.func,
	queryParams: PropTypes.string,
};

ResultsList.defaultProps = {
	results: [],
	selectedResults: [],
};

export default ResultsList;
