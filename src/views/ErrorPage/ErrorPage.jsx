import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGlobal } from '../../store/actions';
import { Helmet } from 'react-helmet';
import { ChatOpener, Delighter } from '../../components/atomic';
import { useTracking } from 'react-tracking';
import { TRY_NEW_SEARCH_LINK } from '../../constants';

import './ErrorPage.scss';

const ErrorPage = ({ initErrorsList }) => {

  const dispatch = useDispatch();
  const formSnapshot = useSelector(store => store.form);
  const tracking = useTracking();
  const { analyticsName, canonicalHost } = useSelector(store => store.globals);

  useEffect(() => {

    const pageTitle = 'Errors Occurred';

    // Fire off page load event
    tracking.trackEvent({
      // These properties are required.
      type: 'PageLoad',
      event: `ClinicalTrialsSearchApp:Load:Error`,
      analyticsName,
      // Todo: Name, title, metaTitle confirmation
      metaTitle: pageTitle,
      name: `${window.location.host + window.location.pathname}`,
      title: pageTitle,
      // Any additional properties fall into the "page.additionalDetails" bucket
      // for the event.
    });
  }, []);

  const handleStartOver = () => {
    tracking.trackEvent({
      type: 'Other',
      event: 'ClinicalTrialsSearchApp:Other:NewSearchLinkClick',
      analyticsName,
      linkName: 'CTStartOverClick',
      formType: '',
      source: TRY_NEW_SEARCH_LINK
    });

    dispatch(updateGlobal({
      field: 'initErrorsList',
      value: []
    }));
  };

  const getFieldNameDisplay = fieldName => {
    const fieldNameMap = {
      cancerType: 'Cancer Type/Condition',
      age: 'Age',
      subtypes: 'Subtypes',
      stages: 'Stages',
      findings: 'Findings',
      keywordPhrases: 'Keywords and Phrases',
      zip: 'Zip',
      zipCoords: 'Zip',
      country: 'Country',
      healthyVolunteers: 'Healthy Volunteers',
      trialTypes: 'Trial Type',
      states: 'States',
      city: 'City',
      drugs: 'Drug/Drug Family',
      treatments: 'Other Treatments',
      trialId: 'Trial ID',
      investigator: 'Trial Investigators',
      leadOrg: 'Lead Organization',
      formType: 'Form Version',
    };
    return fieldNameMap[fieldName] || fieldName;
  };

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

  return (
    <>
      <Helmet>
        <title>
          Clinical Trials Search - National Cancer Institute
        </title>
        <meta property="og:title" content="Clinical Trials Search" />

        <meta
          name="description"
          content="Find an NCI-supported clinical trial - Search"
        />
        <meta
          property="og:description"
          content="Find an NCI-supported clinical trial - Search"
        />
      </Helmet>
      <article className="error-page">
        <h1>Clinical Trials Search</h1>

        <div className="error-page__content">
          <div className="error-page__control --top">
            <div className="error-page__list">
              <div className="error-list">
                <p>
                  Sorry, you seem to have entered invalid criteria. Please check
                  the following, and try your search again:
                </p>
                <ul>
                  {initErrorsList.map(item => (
                    <li key={item}>
                      {getFieldNameDisplay(item.fieldName)}
                    </li>
                  ))}
                </ul>
                <p>
                  For assistance, please contact the Cancer Information Service. You can{' '}
                  <ChatOpener />{' '}
                  or call 1-800-4-CANCER (1-800-422-6237).
                </p>
                <p>
                  <a
                    href={`${
                      formSnapshot.formType === 'basic'
                        ? '/about-cancer/treatment/clinical-trials/search'
                        : '/about-cancer/treatment/clinical-trials/search/advanced'
                    }`}
                    onClick={handleStartOver}
                  >
                    Try a new search
                  </a>
                </p>
              </div>
              <aside className="error-page__aside --side">
                {renderDelighters()}
              </aside>
            </div>
          </div>
        </div>
        <aside className="error-page__aside --bottom">
          {renderDelighters()}
        </aside>
      </article>
    </>
  );
};

export default ErrorPage;
