import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveData } from '../../store/actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Checkbox from '../../components/atomic/Checkbox';
import { isWithinRadius } from '../../utilities';
import { NIH_ZIPCODE } from '../../constants';

const queryString = require('query-string');

const ResultsListItem = ({
  id,
  item,
  isChecked,
  onCheckChange,
  queryParams,
  tracking,
  itemIndex,
}) => {
  const dispatch = useDispatch();
  const {
    zipCoords,
    zipRadius,
    location,
    country,
    states,
    city,
    vaOnly,
  } = useSelector(store => store.form);

  const qsQbj = queryString.parse(queryParams);
  qsQbj.id = item.nciID;
  const itemQueryString = queryString.stringify(qsQbj, {
    arrayFormat: 'comma',
  });

  //compare site values against user criteria
  const isLocationParamMatch = siteObj => {
    if (siteObj.country === country) {
      if (country === 'United States') {
        if (states.length > 0) {
          const statesList = [...new Set(states.map(item => item.abbr))];
          if (statesList.includes(siteObj.stateOrProvinceAbbreviation)) {
            if (siteObj.city && siteObj.city === city) {
              return true;
            }
            return true;
          } else {
            return false;
          }
        }
        if (city !== '') {
          if (siteObj.city === city) {
            return true;
          } else {
            return false;
          }
        }
        // only looking for US sites
        return true;
      } else {
        // check for city
        if (city !== '') {
          if (siteObj.city === city) {
            return true;
          } else {
            return false;
          }
        } else {
          // only searching on country but is match
          return true;
        }
      }
    } else {
      return false;
    }
  };

  //compare site values against user criteria
  const isNIHParamMatch = siteObj => {
    return siteObj.postalCode === NIH_ZIPCODE;
  };

  const countNearbySitesByZip = arr => {
    return arr.reduce(
      (count, siteItem) =>
        count + isWithinRadius(zipCoords, siteItem.coordinates, zipRadius),
      0
    );
  };

  const countNearbySitesByCountryParams = arr => {
    return arr.reduce(
      (count, siteItem) => count + isLocationParamMatch(siteItem),
      0
    );
  };

  const countNearbySitesByNIHParams = arr => {
    return arr.reduce(
      (count, siteItem) => count + isNIHParamMatch(siteItem),
      0
    );
  };

  const getGenderDisplay = genderVal => {
    const displays = {
      MALE: 'Male',
      FEMALE: 'Female',
      BOTH: 'Male or Female',
    };
    return displays[genderVal];
  };

  const getAgeDisplay = () => {
    if (
      item.eligibilityInfo.structuredCriteria.minAgeInt === 0 &&
      item.eligibilityInfo.structuredCriteria.maxAgeInt > 120
    ) {
      return 'Not Specified';
    }
    if (
      item.eligibilityInfo.structuredCriteria.minAgeInt === 0 &&
      item.eligibilityInfo.structuredCriteria.maxAgeInt < 120
    ) {
      return `${item.eligibilityInfo.structuredCriteria.minAgeInt} years and younger`;
    }
    if (
      item.eligibilityInfo.structuredCriteria.minAgeInt > 0 &&
      item.eligibilityInfo.structuredCriteria.maxAgeInt < 120
    ) {
      return `${item.eligibilityInfo.structuredCriteria.minAgeInt} to ${item.eligibilityInfo.structuredCriteria.maxAgeInt} years`;
    }
    if (
      item.eligibilityInfo.structuredCriteria.minAgeInt > 0 &&
      item.eligibilityInfo.structuredCriteria.maxAgeInt > 120
    ) {
      return `${item.eligibilityInfo.structuredCriteria.minAgeInt} years and over`;
    }
  };

  const getLocationDisplay = () => {
    // NOTE: Displays for count should be ONLY US sites
    // unless it is a country search and the country
    // is not US.
    const sitesListAll =
      location === 'search-location-country' && country !== 'United States'
        ? item.sites
        : item.sites.filter(site => site.country === 'United States');

    // If there are no sites we need to display special information
    if (sitesListAll.length === 0) {
      // The old code also referenced a "not yet active" status, which does not exist, so
      // we are going to ignore that.
      if (
        item.currentTrialStatus === 'Approved' ||
        item.currentTrialStatus === 'In Review'
      ) {
        return 'Location information is not yet available';
      } else {
        return (
          <>
            See{' '}
            <a
              href={`https://www.clinicaltrials.gov/show/${item.nctID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ClinicalTrials.gov
            </a>
          </>
        );
      }
    }

    // A single study site shows the name of the organiztion.
    // Don't ask me (bp) what the ID is of a trial that has no
    // US sites and only a single forign site.
    if (sitesListAll.length === 1) {
      const site = sitesListAll[0];
      let displayText = `${site.name}, ${site.city}, `;
      displayText +=
        site.country === 'United States'
          ? site.stateOrProvinceAbbreviation
          : site.country;
      return displayText;
    }

    // We filter on VA here to cut down on conditionals
    // in all the cout by.
    const sitesListForNearCount = vaOnly
      ? sitesListAll.filter(site => site.isVA)
      : sitesListAll;

    // Assume that search-location-zip means that
    // you have a properly filled in zip code.
    if (location === 'search-location-zip') {
      //has a zip
      if (zipCoords.lat !== '' && zipCoords.long !== '') {
        return `${sitesListAll.length} location${
          sitesListAll.length === 1 ? '' : 's'
        }, including ${countNearbySitesByZip(sitesListForNearCount)} near you`;
      }
    } else if (location === 'search-location-country') {
      return `${sitesListAll.length} location${
        sitesListAll.length === 1 ? '' : 's'
      }, including ${countNearbySitesByCountryParams(
        sitesListForNearCount
      )} near you`;
    } else if (location === 'search-location-nih') {
      return `${sitesListAll.length} location${
        sitesListAll.length === 1 ? '' : 's'
      }, including ${countNearbySitesByNIHParams(
        sitesListForNearCount
      )} near you`;
    } else if (vaOnly) {
      // This accounts for search-location-all and vaOnly. The old code made sure
      // hospital + va would not display, but the new logic should not have this
      // issue.
      return `${sitesListAll.length} location${
        sitesListAll.length === 1 ? '' : 's'
      }, including ${sitesListForNearCount.length} near you`;
    }
    return `${sitesListAll.length} location${
      sitesListAll.length === 1 ? '' : 's'
    }`;
  };

  const setCachedTitle = () => {
    dispatch(receiveData('currentTrialTitle', item.briefTitle));
  };

  const handleLinkClick = () => {
    tracking({
      action: 'click',
      source: 'results_page_link',
      data: {
        resultsPosition: itemIndex,
      },
    });
    setCachedTitle();
  };

  return (
    <div className="results-list-item results-list__item">
      <div className="results-list-item__checkbox">
        <Checkbox
          id={id || item.nciID}
          name={item.nciID}
          checked={isChecked}
          label="Select this article for print"
          hideLabel
          onChange={() => onCheckChange(id)}
        />
      </div>
      <div className="results-list-item__contents">
        <div className="results-list-item__title">
          <Link
            to={`/about-cancer/treatment/clinical-trials/search/v?${itemQueryString}`}
            onClick={handleLinkClick}
          >
            {item.briefTitle}
          </Link>
        </div>
        <div className="results-list-item__category">
          <span>Status:</span>
          {item.currentTrialStatus ? 'Active' : 'Active'}
        </div>
        <div className="results-list-item__category">
          <span>Age:</span>
          {getAgeDisplay()}
        </div>
        <div className="results-list-item__category">
          <span>Gender:</span>
          {getGenderDisplay(item.eligibilityInfo.structuredCriteria.gender)}
        </div>
        <div className="results-list-item__category">
          <span>Location:</span>
          {getLocationDisplay()}
        </div>
      </div>
    </div>
  );
};

ResultsListItem.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
  isChecked: PropTypes.bool,
  onCheckChange: PropTypes.func.isRequired,
};

ResultsListItem.defaultProps = {
  results: [],
  isChecked: false,
};

export default ResultsListItem;
