import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';
import { updateFormField, clearForm, receiveData } from '../../store/actions';
import {
  ChatOpener,
  Delighter,
  Checkbox,
  Modal,
  Pager,
} from '../../components/atomic';
import { TRY_NEW_SEARCH_LINK } from '../../constants';
import { buildQueryString, formToTrackingData } from '../../utilities';
import { useModal, useStoreToFindTrials } from '../../hooks';
import ResultsPageHeader from './ResultsPageHeader';
import ResultsList from './ResultsList';
import { history } from '../../services/history.service';
import PrintModalContent from './PrintModalContent';
import { trackedEvents } from '../../tracking';

const queryString = require('query-string');

const ResultsPage = ({ location }) => {

  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [pagerPage, setPagerPage] = useState(0);

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [trialResults, setTrialResults] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [isPageLoadReady, setIsPageLoadReady ] = useState(false);
  const formSnapshot = useSelector(store => store.form);
  const { resultsPage } = useSelector(store => store.form);
  const cache = useSelector(store => store.cache);
  const [qs, setQs] = useState(
    queryString.stringify(buildQueryString(formSnapshot), {
      arrayFormat: 'none',
    })
  );
  const [storeRehydrated, setStoreRehydrated] = useState(false);
  const [currCacheKey, setCurrCacheKey] = useState('');
  const [{ fetchTrials }] = useStoreToFindTrials();
  const [selectedResults, setSelectedResults] = useState(
    cache['selectedTrialsForPrint'] || []
  );
  const tracking = useTracking();
  const { analyticsName, basePath, canonicalHost, siteName, ctsTitle } = useSelector(store => store.globals);

  const handleUpdate = (field, value) => {
    dispatch(
      updateFormField({
        field,
        value,
      })
    );
  };

  const handleTracking = analyticsPayload => {
    tracking.trackEvent(analyticsPayload);
  };

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (trialResults && trialResults.total >= 0) {
      initData();
    } else if (!formSnapshot.hasInvalidZip) {
      // data is in the store
      setCurrCacheKey(qs);
      fetchTrials(qs);
    } else {
      //something went wrog
      setPageIsLoading(false);
      setIsLoading(false);
    }
  }, []);

  // I think this code is inert since the initial state
  // is false, and nothing calls storeRehydrated except
  // itself
  // useEffect(() => {
  //   if (storeRehydrated) {
  //     setIsLoading(true);
  //     setCurrCacheKey(locsearch);
  //     fetchTrials(locsearch);
  //     setStoreRehydrated(false);
  //   }
  // }, [storeRehydrated]);

  //when trial results come in, open up shop
  useEffect(() => {
    if (isLoading && cache[currCacheKey] && cache[currCacheKey].total >= 0) {
      initData();
    }
  }, [cache[currCacheKey]]);

  useEffect(() => {
    // This should also be dependent on the current route/url
    if (isPageLoadReady) {
      handleTracking({
        // These properties are required.
        type: 'PageLoad',
        event: `ClinicalTrialsSearchApp:Load:Results`,
        analyticsName,
        name: `${canonicalHost.replace('https://', '')}${basePath}`,
        // Any additional properties fall into the "page.additionalDetails" bucket
        // for the event.
        title: `Clinical Trials Search Results - ${siteName}`,
        metaTitle: `Clinical Trials Search Results`,
        status: 'success',
        formType: formSnapshot.formType,
        numResults: resultsCount,
        formData: formToTrackingData(formSnapshot),
      });
      // Since we can page we need to prep isPageLoadReady
      setIsPageLoadReady(false);
    }
  }, [isPageLoadReady]);

  //track usage of selected results for print
  useEffect(() => {
    // update cacheStore with new selectedResults Value
    dispatch(receiveData('selectedTrialsForPrint', [...selectedResults]));
    if (selectedResults.length > 100) {
      //max number of print selections made
      handleTracking({
        // These properties are required.
        type: 'Other',
        event: 'ClinicalTrialsSearchApp:Other:PrintSelectedMaxReached',
        analyticsName,
        linkName: 'CTSResultsSelectedErrorClick',
        // Any additional properties fall into the "page.additionalDetails" bucket
        // for the event.
        formType: formSnapshot.formType,
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
      ...new Set(trialResults.trials.map(item => {
        let resItem = {
          id: item.nciID,
          fromPage: formSnapshot.resultsPage + 1
        }
        return resItem;
      }))
    ];

    let simpleIds =  pageResultIds.map(({id})=> id);

    if (!selectAll) {
      setSelectAll(true); 
      setSelectedResults([...new Set([...selectedResults, ...pageResultIds])]);
    } else {
      setSelectAll(false);
      setSelectedResults(
        selectedResults.filter(item => !simpleIds.includes(item.id))
      );
    }
  };

  const handleStartOver = (linkType) => {
    handleTracking({
      type: 'Other',
      event: 'ClinicalTrialsSearchApp:Other:NewSearchLinkClick',
      analyticsName,
      linkName: 'CTStartOverClick',
      formType: formSnapshot.formType,
      source: linkType
    });
    dispatch(clearForm());
  };

  // setup print Modal
  const { isShowing, toggleModal } = useModal();
  const printSelectedBtn = useRef(null);

  const handlePagination = currentPage => {
    if (currentPage !== pagerPage) {
      setIsLoading(true);
      // set currentPage and kick off fetch
      setPagerPage(currentPage);
      handleUpdate('resultsPage', currentPage);

      // update qs
      const parsed = queryString.parse(location.search);
      parsed.pn = currentPage + 1;
      let newqs = queryString.stringify(parsed, { arrayFormat: 'none' });
      setQs(newqs);
      setCurrCacheKey(newqs);
      history.push({
        search: newqs,
      });
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
            We're here to help
          </>
        }
      >
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
        titleText={<>Which trials are right for you?</>}
      >
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
            }`}
          >
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
                    data-pos={isBottom? 'bottom' : 'top'}
                  >
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
        event: 'ClinicalTrialsSearchApp:Other:PrintNoneSelectedClick',
        analyticsName,
        linkName: 'CTSResultsSelectedErrorClick',
        formType: formSnapshot.formType
      });
    } else if (selectedResults.length >= 100){
      handleTracking({
        type: 'Other',
        event: 'ClinicalTrialsSearchApp:Other:PrintMaxExceededClick',
        analyticsName,
        linkName: 'CTSResultsSelectedErrorClick',
        formType: formSnapshot.formType
      });
    } else {
      handleTracking({
        type: 'Other',
        event: 'ClinicalTrialsSearchApp:Other:PrintSelectedButtonClick',
        analyticsName,
        linkName: 'CTSResultsPrintSelectedClick',
        formType: formSnapshot.formType,
        buttonPos,
        selectAll,
        selectedCount: selectedResults.length,
        pagesWithSelected: [...new Set(selectedResults.map(({fromPage}) => fromPage) )]
      });
    }

    toggleModal();
  };

  const renderInvalidZip = () => {
    handleTracking({
      // These properties are required.
      type: 'PageLoad',
      event: `ClinicalTrialsSearchApp:Load:Results`,
      analyticsName,
      name: `${canonicalHost.replace('https://', '')}${basePath}/r?${qs}`,
      title: `${ctsTitle} - Search results`,
      // Any additional properties fall into the "page.additionalDetails" bucket
      // for the event.
      status: 'error',
      formType: formSnapshot.formType
    });
    return (
      <div className="results-list invalid-zip">
        <p>
          Sorry you seem to have entered invalid criteria. Please check the
          following, and try your search again:
        </p>
        <ul>
          <li>Zip Code</li>
        </ul>
        <div>
          For assistance, please contact the Cancer Information Service. You can{' '}
          <ChatOpener /> or call 1-800-4-CANCER (1-800-422-6237).
        </div>
        <p>
          <Link
            to={`${
              formSnapshot.formType === 'basic'
                ? '/about-cancer/treatment/clinical-trials/search'
                : '/about-cancer/treatment/clinical-trials/search/advanced'
            }`}
            onClick={() => handleStartOver(TRY_NEW_SEARCH_LINK)}
          >
            Try a new search
          </Link>
        </p>
      </div>
    );
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
              formSnapshot.formType === 'basic'
                ? '/about-cancer/treatment/clinical-trials/search'
                : '/about-cancer/treatment/clinical-trials/search/advanced'
            }`}
            onClick={() => handleStartOver(TRY_NEW_SEARCH_LINK)}
          >
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
        {formSnapshot.hasInvalidZip ? (
          <>{renderInvalidZip()}</>
        ) : (
          <>
            {isLoading ? (
              <div className="loader__pageheader"></div>
            ) : (
              <ResultsPageHeader
                resultsCount={resultsCount}
                pageNum={resultsPage}
                handleUpdate={handleUpdate}
                handleReset={handleStartOver}
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
          handleClose={toggleModal}
        />
      </Modal>
    </>
  );
};

export default ResultsPage;
