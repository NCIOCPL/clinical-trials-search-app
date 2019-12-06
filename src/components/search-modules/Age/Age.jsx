import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Fieldset, TextInput } from '../../atomic';

const Age = ({ handleUpdate }) => {
  const { age, ageModified, formType } = useSelector(store => store.form);
  const [inputtedAge, setInputtedAge] = useState(age);
  const [errorMessage, setErrorMessage] = useState('');

  const validateAgeEntry = () => {
    if (inputtedAge !== '' && (isNaN(inputtedAge) || inputtedAge > 120 || inputtedAge < 1)) {
      setErrorMessage('Please enter a number between 1 and 120.');
      handleUpdate('age', '');
      handleUpdate('hasInvalidAge', true);
    } else {
      setErrorMessage('');
      handleUpdate('age', inputtedAge);
      handleUpdate('hasInvalidAge', false);
    }

    if (ageModified) {
      handleUpdate('ageModified', false);
    }
  };

  const updateAge = a => {
    setErrorMessage('');
    setInputtedAge(a);
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
        action={e => updateAge(e.target.value)}
        id="age"
        value={inputtedAge}
        label="age"
        labelHidden
        errorMessage={errorMessage}
        inputHelpText={helperText}
        maxLength={3}
        onBlur={validateAgeEntry}
        modified={ageModified}
      />
    </Fieldset>
  );
};

export default Age;
