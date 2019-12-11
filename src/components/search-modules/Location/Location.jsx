import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Fieldset,
  TextInput,
  Radio,
  Toggle,
  Dropdown,
  Autocomplete,
} from '../../atomic';
import { getCountries, searchHospital } from '../../../store/actions';
import {
  matchItemToTerm,
  sortItems,
  getStates,
  matchStateToTerm,
  sortStates,
} from '../../../utilities';
import { useZipConversion } from '../../../hooks';
import './Location.scss';

const Location = ({ handleUpdate }) => {
  //Hooks must always be rendered in same order.
  const dispatch = useDispatch();
  const [{ getZipCoords }] = useZipConversion(handleUpdate);
  const { countries = [], hospitals = [] } = useSelector(store => store.cache);
  const {
    location,
    zip,
    zipModified,
    zipRadius,
    hasInvalidZip,
    country,
    city,
    states,
    hospital,
    vaOnly,
    refineSearch
  } = useSelector(store => store.form);
  const [activeRadio, setActiveRadio] = useState(location);
  const [inputtedZip, setInputtedZip] = useState(zip);
  const [limitToVA, setLimitToVA] = useState(vaOnly);
  const [showStateField, setShowStateField] = useState(true);

  //hospital
  const [hospitalName, setHospitalName] = useState({ value: hospital.term });

  //state input
  const [stateVal, setStateVal] = useState({ value: '' });
  const stateOptions = getStates();


  useEffect(() => {
    if (hospitalName.value.length > 2) {
      dispatch(searchHospital({ searchText: hospitalName.value }));
    }
  }, [hospitalName, dispatch]);

  useEffect(() => {
    handleUpdate('location', activeRadio);
    handleUpdate('nihOnly', activeRadio === 'search-location-nih');
    if(activeRadio === 'search-location-country' && countries.length < 1){
      dispatch(getCountries());
    }
  }, [activeRadio, dispatch]);

  const handleToggleChange = () => {
    let newVal = !limitToVA;
    setLimitToVA(newVal);
    handleUpdate('vaOnly', newVal);
    // make sure that the newly hidden selections are not selected
    if (
      activeRadio === 'search-location-nih' ||
      activeRadio === 'search-location-hospital'
    ) {
      setActiveRadio('search-location-all');
      handleUpdate('hospital', { term: '', termKey: '' });
    }
  };

  const handleRadioChange = e => {
    setActiveRadio(e.target.value);
  };

  const handleCountryOnChange = e => {
    const country = e.target.value;
    handleUpdate('country', country);
    if (country === 'United States') {
      setShowStateField(true);
    } else {
      setShowStateField(false);
    }
  };

  const filterSelectedItems = (items = [], selections = []) => {
    if (!items.length || !selections.length) {
      return items;
    }
    return items.filter(
      item => !selections.find(selection => selection.name === item.name)
    );
  };

  useEffect(() => {
    if (inputtedZip.length === 5) {
      getZipCoords(inputtedZip);
      validateZip();
    } else if (inputtedZip === '') {
      clearZip();
    } else {
      // prepopulated with a 5 digit zip has been modified
      if (zipModified) {
        handleUpdate('zipModified', false);
      }
    }
  }, [inputtedZip]);

  const handleZipUpdate = e => {
    setInputtedZip(e.target.value);
  };

  const clearZip = () => {
    handleUpdate('zip', '');
    handleUpdate('zipCoords', { lat: '', long: '' });
    handleUpdate('hasInvalidZip', false);
  };

  const validateZip = () => {
    if (inputtedZip.length === 5) {
      // test that all characters are numbers
      if (isNaN(inputtedZip)) {
        handleUpdate('hasInvalidZip', true);
      } else {
        handleUpdate('zip', inputtedZip);
        handleUpdate('location', 'search-location-zip');
      }
    } else if (inputtedZip.length === 0) {
      // empty treat as blank
      clearZip();
    } else {
      handleUpdate('hasInvalidZip', true);
    }
  };

  return (
    <Fieldset
      id="location"
      legend="Location"
      helpUrl="/about-cancer/treatment/clinical-trials/search/help#location"
      classes="search-location"
    >
      <p>
        Search for trials near a specific zip code; or in a country, state and
        city; or at a particular institution. The default selection will search
        for trials in all available locations. You may choose to limit results
        to Veterans Affairs facilities.
      </p>
      <div className="data-toggle-block">
        <Toggle
          id="search-location-toggle"
          checked={limitToVA}
          label="Limit results to Veterans Affairs facilities"
          onClick={handleToggleChange}
          onChange={()=>{}}
        />
        Limit results to Veterans Affairs facilities
      </div>
      <div className="group-locations">
        <Radio
          onChange={handleRadioChange}
          id="search-location-all"
          label="Search All Locations"
          checked={activeRadio === 'search-location-all'}
        />
        <Radio
          onChange={handleRadioChange}
          id="search-location-zip"
          label="ZIP Code"
          checked={activeRadio === 'search-location-zip'}
        />
        {activeRadio === 'search-location-zip' && (
          <div className="search-location__block search-location__zip">
            <div className="two-col">
              <TextInput
                action={handleZipUpdate}
                id="zip"
                value={zip}
                classes="search-location__zip --zip"
                label="U.S. ZIP Code"
                modified={zipModified}
                errorMessage={hasInvalidZip? 'Please enter a valid 5 digit U.S. zip code' : ''}
                onBlur={validateZip}
                maxLength={5}
              />
              <Dropdown
                action={e => handleUpdate(e.target.id, e.target.value)}
                id="zipRadius"
                value={zipRadius}
                classes="search-location__zip --radius"
                label="Radius"
              >
                {['20', '50', '100', '200', '500'].map(dist => {
                  return (
                    <option key={dist} value={dist}>{`${dist} miles`}</option>
                  );
                })}
              </Dropdown>
            </div>
          </div>
        )}
        <Radio
          onChange={handleRadioChange}
          id="search-location-country"
          label="Country, State, City"
          checked={activeRadio === 'search-location-country'}
        />
        {activeRadio === 'search-location-country' && (
          <div className="search-location__block search-location__country">
            <Dropdown
              classes="search-location__country --country"
              id="country"
              label="Country"
              action={handleCountryOnChange}
              value={country}
            >
              {countries.map(city => {
                return <option key={city} value={city}>{`${city}`}</option>;
              })}
            </Dropdown>
            <div
              className={`search-location__country ${
                showStateField ? 'two-col' : ''
              }`}
            >
              {showStateField && (
                <Autocomplete
                  id="lst"
                  label="State"
                  value={stateVal.value}
                  inputHelpText="More than one selection may be made."
                  inputClasses="--state"
                  items={filterSelectedItems(stateOptions, states)}
                  getItemValue={item => item.name}
                  shouldItemRender={matchStateToTerm}
                  sortItems={sortStates}
                  onChange={(event, value) => setStateVal({ value })}
                  onSelect={value => {
                    handleUpdate('states', [
                      ...states,
                      stateOptions.find(({ name }) => name === value),
                    ]);
                    setStateVal({ value: '' });
                  }}
                  multiselect={true}
                  chipList={states}
                  onChipRemove={e => {
                    let newChips = states.filter(item => item.name !== e.label);
                    handleUpdate('states', [...newChips]);
                  }}
                  renderMenu={children => {
                    return (
                      <div className="cts-autocomplete__menu --drugs">
                        {
                          filterSelectedItems(stateOptions, states).length ? (
                            children
                          ) : (
                            <div className="cts-autocomplete__menu-item">
                              No results found
                            </div>
                          )
                        }
                      </div>
                    );
                  }}
                  renderItem={(item, isHighlighted) => (
                    <div
                      className={`cts-autocomplete__menu-item ${
                        isHighlighted ? 'highlighted' : ''
                      }`}
                      key={item.abbr}
                    >
                      {item.name}
                    </div>
                  )}
                />
              )}
              <TextInput
                action={e => handleUpdate(e.target.id, e.target.value)}
                id="city"
                label="City"
                value={city}
              />
            </div>
          </div>
        )}
        {!limitToVA && (
          <>
            <Radio
              onChange={handleRadioChange}
              id="search-location-hospital"
              label="Hospitals/Institutions"
              checked={activeRadio === 'search-location-hospital'}
            />
            {activeRadio === 'search-location-hospital' && (
              <div className="search-location__block">
                <Autocomplete
                  label="hospitals / institutions"
                  labelHidden
                  value={hospitalName.value}
                  inputProps={{
                    id: 'hos',
                    placeholder:
                      'Start typing to select a hospital or institution',
                  }}
                  wrapperStyle={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                  items={hospitals}
                  getItemValue={item => item.term}
                  shouldItemRender={matchItemToTerm}
                  sortItems={sortItems}
                  onChange={(event, value) => setHospitalName({ value })}
                  onSelect={(value, item) => {
                    handleUpdate('hospital', item);
                    setHospitalName({ value: item.term });
                  }}
                  renderMenu={children => (
                    <div className="cts-autocomplete__menu --hospitals">
                      {hospitalName.value.length > 2 ? (
                        hospitals.length ? (
                          children
                        ) : (
                          <div className="cts-autocomplete__menu-item">
                            No results found
                          </div>
                        )
                      ) : (
                        <div className="cts-autocomplete__menu-item">
                          Please enter 3 or more characters
                        </div>
                      )}
                    </div>
                  )}
                  renderItem={(item, isHighlighted) => (
                    <div
                      className={`cts-autocomplete__menu-item ${
                        isHighlighted ? 'highlighted' : ''
                      }`}
                      key={item.termKey}
                    >
                      {item.term}
                    </div>
                  )}
                />
              </div>
            )}
            <Radio
              onChange={handleRadioChange}
              id="search-location-nih"
              label="At NIH (only show trials at the NIH Clinical Center in Bethesda, MD)"
              checked={activeRadio === 'search-location-nih'}
            />
          </>
        )}
      </div>
    </Fieldset>
  );
};

export default Location;
