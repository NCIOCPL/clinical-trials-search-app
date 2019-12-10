import React from 'react';
import track from 'react-tracking';
import SearchPage from './SearchPage'

const AdvancedSearchPage = ({ tracking }) => {
  return (
    <SearchPage formInit='advanced' tracking={tracking} />
  )
}

export default track({
  page: "advanced_search",
})(AdvancedSearchPage);