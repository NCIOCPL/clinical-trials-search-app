import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import ResultsListItem from './ResultsListItem';


const ResultsList = ({ results, selectedResults, setSelectedResults, setSelectAll, queryParams, tracking }) => {
  const resultsPage = useSelector(store => store.form.resultsPage);

  const handleOnCheckChange = id => {
    let resultItem = {
      id: id,
      fromPage: resultsPage + 1
    }
    
    //if the new item does not already exist in the selected results, add it
    if (selectedResults.filter( item => item.id === resultItem.id).length === 0) {
      setSelectedResults([...selectedResults, resultItem]);
    } else {
      // remove from selected
      setSelectAll(false);
      setSelectedResults(selectedResults.filter(item => item.id !== id));
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
            isChecked={selectedResults.find( ({id}) => id === item.nciID) !== undefined}
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
