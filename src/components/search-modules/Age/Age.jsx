import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Fieldset, TextInput } from '../../atomic';
import { trackedEvents } from '../../../tracking';

const Age = ({ handleUpdate, tracking }) => {
  const { age, ageModified, formType } = useSelector(store => store.form);
  const [inputtedAge, setInputtedAge] = useState(age);
  const [errorMessage, setErrorMessage] = useState('');

  const validateAgeEntry = (a) => {
    const { InputValidation } = trackedEvents;
    const invalidAgeText = 'Please enter a number between 1 and 120.';
    setInputtedAge(a);
    if (a !== '' && (isNaN(a) || a > 120 || a < 1)) {
      setErrorMessage(invalidAgeText);
      handleUpdate('age', '');
      handleUpdate('hasInvalidAge', true);
      InputValidation.data.field = 'age';
      InputValidation.data.formType = formType;
      InputValidation.data.message = invalidAgeText;
      tracking.trackEvent(InputValidation);
    } else {
      setErrorMessage('');
      handleUpdate('age', a);
      handleUpdate('hasInvalidAge', false);
    }
    if (ageModified) {
      handleUpdate('ageModified', false);
    }
  };

  const helperText =
    formType === 'basic'
      ? 'Your age helps determine which trials are right for you.'
      : 'Enter the age of the participant.';

  return (
    <Fieldset
      id="age"
      legend="Age"
      helpUrl="/about-cancer/treatment/clinical-trials/search/help#age"
    >
      <TextInput
        action={e => validateAgeEntry(e.target.value)}
        id="age"
        value={inputtedAge}
        label="age"
        labelHidden
        errorMessage={errorMessage}
        inputHelpText={helperText}
        maxLength={3}
        onChange={validateAgeEntry}
        modified={ageModified}
      />
    </Fieldset>
  );
};

export default Age;
