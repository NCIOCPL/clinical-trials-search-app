import React from 'react';
import track from 'react-tracking';
import SearchPage from './SearchPage'

const BasicSearchPage = ({ tracking }) => {
  return (
    <SearchPage formInit='basic' tracking={tracking} />
  )
}

export default track({
  page: "basic_search",
})(BasicSearchPage);