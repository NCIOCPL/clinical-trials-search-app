import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, TextInput } from '../../atomic';
import { useZipConversion } from '../../../hooks';

const ZipCode = ({ handleUpdate }) => {
  const { zip, hasInvalidZip } = useSelector(store => store.form);
  const [inputtedZip, setInputtedZip] = useState('');
  const [{ getZipCoords }] = useZipConversion(handleUpdate);

  useEffect(() => {
    if (inputtedZip.length === 5) {
      getZipCoords(inputtedZip);
      validateZip();
    } else if (inputtedZip === '') {
      clearZip();
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
      id="zip"
      legend="U.S. Zip Code"
      helpUrl="/about-cancer/treatment/clinical-trials/search/help#basicsearch"
    >
      <TextInput
        action={handleZipUpdate}
        id="zip"
        label="zip code"
        labelHidden
        errorMessage={
          hasInvalidZip ? 'Please enter a valid 5 digit U.S. zip code' : ''
        }
        inputHelpText="Show trials near this U.S. ZIP code."
        maxLength={5}
        value={zip}
        onBlur={validateZip}
        isTrackingEnabled
      />
    </Fieldset>
  );
};

export default ZipCode;
