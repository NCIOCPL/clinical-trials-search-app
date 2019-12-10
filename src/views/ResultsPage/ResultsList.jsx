import React from 'react';
import PropTypes from 'prop-types';
import ResultsListItem from './ResultsListItem';


const ResultsList = ({ results, selectedResults, setSelectedResults, setSelectAll, queryParams, tracking }) => {
  const handleOnCheckChange = id => {
    if (selectedResults.indexOf(id) === -1) {
      setSelectedResults([...selectedResults, id]);
    } else {
      // remove from selected
      setSelectAll(false);
      setSelectedResults(selectedResults.filter(item => item !== id));
    }
  };

  return (
    <div className="results-list">
      {results.map((item, idx) => {
        return (
          <ResultsListItem
            queryParams={queryParams}
            key={item.nciID}
            id={item.nciID}
            item={item}
            itemIndex={idx}
            isChecked={selectedResults.indexOf(item.nciID) > -1}
            onCheckChange={handleOnCheckChange}
            tracking={tracking}
          />
        );
      })}
    </div>
  );
};

ResultsList.propTypes = {
  setSelectedResults: PropTypes.func,
  selectedResults: PropTypes.array,
  results: PropTypes.array
};

ResultsList.defaultProps = {
  results: [],
  selectedResults: []
};

export default ResultsList;
