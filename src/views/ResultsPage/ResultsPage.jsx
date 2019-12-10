import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { updateFormField, clearForm, receiveData } from '../../store/actions';
import { ChatOpener, Delighter, Checkbox, Modal, Pager } from '../../components/atomic';
import { buildQueryString } from '../../utilities';
import { useModal, useStoreToFindTrials } from '../../hooks';
import ResultsPageHeader from './ResultsPageHeader';
import ResultsList from './ResultsList';
import { history } from '../../services/history.service';
import PrintModalContent from './PrintModalContent';
import track from 'react-tracking';
import './ResultsPage.scss';
const queryString = require('query-string');

const ResultsPage = ({ location, tracking }) => {
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [pagerPage, setPagerPage] = useState(0);

  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [trialResults, setTrialResults] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  const formSnapshot = useSelector(store => store.form);
  const { resultsPage } = useSelector(store => store.form);
  const cache = useSelector(store => store.cache);
  const locsearch = location.search.replace('?', '');
  const [qs, setQs] = useState(
    queryString.stringify(buildQueryString(formSnapshot), {
      arrayFormat: 'comma',
    })
  );
  const [storeRehydrated, setStoreRehydrated] = useState(false);
  const [currCacheKey, setCurrCacheKey] = useState('');
  const [{ fetchTrials }] = useStoreToFindTrials();
  const [selectedResults, setSelectedResults] = useState(
    cache['selectedTrialsForPrint'] || []
  );
  
  const handleUpdate = (field, value) => {
    dispatch(
      updateFormField({
        field,
        value,
      })
    );
  };

  const handleTracking = (analyticsPayload)  => {
    tracking.trackEvent(analyticsPayload);
  }

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    tracking.trackEvent({action: 'pageLoad', page: window.location.pathname});
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

  useEffect(() => {
    if (storeRehydrated) {
      setIsLoading(true);
      setCurrCacheKey(locsearch);
      fetchTrials(locsearch);
      setStoreRehydrated(false);
    }
  }, [storeRehydrated]);

  //when trial results come in, open up shop
  useEffect(() => {
    if (isLoading && cache[currCacheKey] && cache[currCacheKey].total >= 0) {
      initData();
    }
  }, [cache[currCacheKey]]);

  //track usage of selected results for print
  useEffect(() => {
    // update cacheStore with new selectedResults Value
    dispatch(receiveData('selectedTrialsForPrint', [...selectedResults]));
    if (selectedResults.length > 100) {
      toggleModal();
    }
  }, [selectedResults]);

  const initData = () => {
    window.scrollTo(0, 0);
    setSelectAll(false);
    setPageIsLoading(false);
    setIsLoading(false);
    setTrialResults(cache[currCacheKey]);
    setResultsCount(cache[currCacheKey].total);
  };

  const handleSelectAll = () => {
    const pageResultIds = [
      ...new Set(trialResults.trials.map(item => item.nciID)),
    ];
    if (!selectAll) {
      setSelectAll(true); // toggle the box then check all the trial results boxes
      setSelectedResults([...new Set([...selectedResults, ...pageResultIds])]);
    } else {
      setSelectAll(false);
      setSelectedResults(
        selectedResults.filter(item => !pageResultIds.includes(item))
      );
    }
  };

  const handleStartOver = () => {
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
      let newqs = queryString.stringify(parsed, { arrayFormat: 'comma' });
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
        url="/trial-guide"
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

  const handlePrintSelected = () => {
    toggleModal();
  };

  const renderInvalidZip = () => {
    return (
      <div className="results-list invalid-zip">
        <p>
          Sorry you seem to have entered invalid criteria. Please check the
          following, and try your search again:
        </p>
        <ul>
          <li>Zip Code</li>
        </ul>
        <p>
          For assistance, please contact the Cancer Information Service. You can{' '}
          <ChatOpener />{' '}
          or call 1-800-4-CANCER (1-800-422-6237).
        </p>
        <p>
          <Link
            to={`${
              formSnapshot.formType === 'basic'
                ? '/about-cancer/treatment/clinical-trials/search'
                : '/about-cancer/treatment/clinical-trials/search/advanced'
            }`}
            onClick={handleStartOver}
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
        <p>
          For assistance, please contact the Cancer Information Service. You can{' '}
          <ChatOpener />{' '}
          or call 1-800-4-CANCER (1-800-422-6237).
        </p>
        <p>
          <Link
            to={`${
              formSnapshot.formType === 'basic'
                ? '/about-cancer/treatment/clinical-trials/search'
                : '/about-cancer/treatment/clinical-trials/search/advanced'
            }`}
            onClick={handleStartOver}
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

export default track({
  page: window.location.pathname,
})(ResultsPage);
