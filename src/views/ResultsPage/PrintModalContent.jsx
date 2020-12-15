import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePrintApi } from '../../hooks';
import { buildQueryString } from '../../utilities';
const queryString = require('query-string');

const PrintModalContent = ({ selectedList = [], handleClose = () => {} }) => {
  // in dev use
  const printUrl = useSelector(store => store.globals.printCacheEndpoint);
  const formSnapshot = useSelector(store => store.form);

  const queryParams = buildQueryString(formSnapshot);

  // Support for legacy things
  const queryParamsModified = {
    ...queryParams,
    tp: queryParams['tp']? queryParams['tp'].map(tp=>tp.toUpperCase()) : []
  };
  
  const queryParamsString = queryString.stringify(queryParamsModified, {
    arrayFormat: 'none',
  })

  const printIds =  selectedList.map(({id})=> id);
  const [{ data, isLoading, isError, doPrint }] = usePrintApi(
    { TrialIDs: printIds },
    // Make sure URL gets query params for search criteria on
    // print!!!
    queryParamsString.length > 0 ? printUrl + '?' + queryParamsString : printUrl
  );

  // on component mount, check for selected IDs,
  useEffect(() => {
    if (selectedList.length > 0 && selectedList.length <= 100) {
      doPrint();
    }
  }, [selectedList]);

  useEffect(() => {
    if (!isLoading && data.printID) {
      //success
      window.location.href = `https://www.cancer.gov/CTS.Print/Display?printid=${data.printID}`;
    }
  }, [isLoading, isError, data]);

  const closeModal = () => {
    handleClose();
  };

  const renderNoItemsSelected = () => (
    <>
      <div className="icon-warning" aria-hidden="true">
        !
      </div>
      <p>
        You have not selected any trials. Please select at least one trial to
        print.
      </p>
    </>
  );
  const renderPrintError = () => (
    <>
      <div className="icon-warning" aria-hidden="true">
        !
      </div>
      <p>
        An error occurred while generating your document. Please try again
        later.
      </p>
    </>
  );

  const renderTooManyItemsSelected = () => (
    <>
      <div className="icon-warning" aria-hidden="true">
        !
      </div>
      <p>
        You have selected the maximum number of clinical trials (100) that can
        be printed at one time.
      </p>
      <p>
        Print your current selection and then return to your search results to
        select more trials to print.
      </p>
    </>
  );

  const renderPrintInterstitial = () => (
    <>
      <div className="spinkit spinner">
        <div className="dot1"></div>
        <div className="dot2"></div>
      </div>
      <p>
        You will automatically be directed to your print results in just a
        moment...
      </p>
    </>
  );

  return (
    <>
      {selectedList.length === 0 ? (
        renderNoItemsSelected()
      ) : selectedList.length >= 100 ? (
        renderTooManyItemsSelected()
      ) : (
        <>
          {!isError ? (
            <>{renderPrintInterstitial()}</>
          ) : (
            <>{renderPrintError()}</>
          )}
        </>
      )}
    </>
  );
};

export default PrintModalContent;
