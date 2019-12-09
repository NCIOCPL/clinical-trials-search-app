import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Delighter, StickySubmitBlock } from '../../components/atomic';
import {
  Age,
  CancerTypeCondition,
  CancerTypeKeyword,
  DrugTreatment,
  KeywordsPhrases,
  LeadOrganization,
  Location,
  TrialId,
  TrialInvestigators,
  TrialPhase,
  TrialType,
  ZipCode,
} from '../../components/search-modules';
import { history } from '../../services/history.service';
import { updateFormField, clearForm, receiveData } from '../../store/actions';

//Module groups in arrays will be placed side-by-side in the form
const basicFormModules = [CancerTypeKeyword, [Age, ZipCode]];
const advancedFormModules = [
  CancerTypeCondition,
  [Age, KeywordsPhrases],
  Location,
  TrialType,
  DrugTreatment,
  TrialPhase,
  TrialId,
  TrialInvestigators,
  LeadOrganization,
];

const SearchPage = ({ formInit = 'basic' }) => {
  const dispatch = useDispatch();
  const sentinelRef = useRef(null);
  const [formFactor, setFormFactor] = useState(formInit);
  const {hasInvalidAge, hasInvalidZip} = useSelector(store => store.form)

  const handleUpdate = (field, value) => {
    dispatch(
      updateFormField({
        field,
        value,
      })
    );
  };

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    handleUpdate('formType', formInit);
  }, []);

  let formModules =
    formFactor === 'advanced' ? advancedFormModules : basicFormModules;

  const handleSubmit = e => {
    e.preventDefault();
    if(!hasInvalidAge && !hasInvalidZip){
      dispatch(receiveData(
        'selectedTrialsForPrint',
        []
      ));
      history.push('/about-cancer/treatment/clinical-trials/search/r');
    }
    
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
        classes="cts-what"
        url="/what-are-trials"
        titleText={<>What Are Cancer Clinical Trials?</>}
      >
        <p>Learn what they are and what you should know about them.</p>
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

  const toggleForm = () => {
    dispatch(clearForm());
  };

  const renderSearchTip = () => (
    <div className="cts-search-tip">
      <div className="cts-search-tip__icon">
        <i className="lightbulb-circle-yellow"></i>
      </div>
      <div className="cts-search-tip__body">
        <strong>Search Tip:</strong>
        {formFactor === 'basic' ? (
          <>{` For more search options, use our `}</>
        ) : (
          <>{` All fields are optional. Skip any items that are unknown or not applicable or try our `}</>
        )}
        <a href={`${formFactor === 'advanced'? '/about-cancer/treatment/clinical-trials/search' : '/about-cancer/treatment/clinical-trials/search/advanced'}`}  
        onClick={toggleForm}>
          {formFactor === 'basic' ? 'advanced search' : 'basic search'}
        </a>
        .
      </div>
    </div>
  );

  return (
    <article className="search-page">
      <Helmet>
        <title>
          {`Find NCI-Supported Clinical Trials - ${formFactor === 'advanced' ? 'Advanced Search - ' : ''}National Cancer Institute`}
        </title>
        <link
          rel="canonical"
          href={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search${
            formFactor === 'basic' ? '' : '/advanced'
          }`}
        />
        <meta
          name="description"
          content={`${formFactor === 'basic' ? 'F': 'Use our advanced search to f'}ind an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one.`}
        />
        <meta
          property="og:title"
          content={`Find NCI-Supported Clinical Trials - ${formFactor === 'advanced' ? 'Advanced Search' : ''}`}
        />
        <meta
          property="og:url"
          content={`https://www.cancer.gov/about-cancer/treatment/clinical-trials/search${
            formFactor === 'basic' ? '' : '/advanced'
          }`}
        />
        <meta
          property="og:description"
          content={`${formFactor === 'basic' ? 'F': 'Use our advanced search to f'}ind an NCI-supported clinical trial—and learn how to locate other research studies—that may be right for you or a loved one.`}
        />
      </Helmet>
      <div ref={sentinelRef} className="search-page__sentinel"></div>
      <h1>Find NCI-Supported Clinical Trials</h1>
      <div className="search-page__header">
        <p>
          NCI-supported clinical trials are those sponsored or otherwise
          financially supported by NCI. See our guide,{' '}
          <a href="https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/trial-guide">
            Steps to Find a Clinical Trial
          </a>
          , to learn about options for finding trials not included in NCI's
          collection.
        </p>
        {renderSearchTip()}
      </div>

      <div className="search-page__content">
        <form
          id="cts-search-form"
          onSubmit={handleSubmit}
          className={`search-page__form ${formFactor}`}
        >
          {formModules.map((Module, idx) => {
            if (Array.isArray(Module)) {
              return (
                <div key={`formAdvanced-${idx}`} className="side-by-side">
                  {Module.map((Mod, i) => (
                    <Mod
                      key={`formAdvanced-${idx}-${i}`}
                      handleUpdate={handleUpdate}
                    />
                  ))}
                </div>
              );
            } else {
              return (
                <Module
                  key={`formAdvanced-${idx}`}
                  handleUpdate={handleUpdate}
                />
              );
            }
          })}
          {formFactor === 'advanced' ? (
            <StickySubmitBlock sentinel={sentinelRef} onSubmit={handleSubmit} />
          ) : (
            <div className="static-submit-block">
              <button
                type="submit"
                className="btn-submit faux-btn-submit"
                onClick={handleSubmit}
              >
                Find Trials
              </button>
            </div>
          )}
        </form>
        <aside className="search-page__aside">{renderDelighters()}</aside>
      </div>

      <div className="search-page__footer">
        <div className="api-reference-section">
          <h3 id="ui-id-4">
            The Clinical Trials API: Use our data to power your own clinical
            trial search
          </h3>
          <p className="api-reference-content">
            An application programming interface (API) helps translate large
            amounts of data in meaningful ways. NCI’s clinical trials search
            data is now powered by an API, allowing programmers to build
            applications <a href="/syndication/api">using this open data.</a>
          </p>
        </div>
      </div>
    </article>
  );
};

export default SearchPage;
