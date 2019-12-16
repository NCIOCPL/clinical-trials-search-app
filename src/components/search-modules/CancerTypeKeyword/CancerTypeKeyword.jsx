import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Fieldset, Autocomplete } from '../../atomic';
import { getDiseasesForSimpleTypeAhead } from '../../../store/actions';
import { sortItemsByName } from '../../../utilities'

const CancerTypeKeyword = ({ handleUpdate, handleFormStoreTracking }) => {
  const dispatch = useDispatch();
  const { keywordPhrases, cancerType } = useSelector(store => store.form);
  const { diseases = [] } = useSelector(store => store.cache);

  const [CTK, setCTK] = useState({ value: (cancerType.name)? cancerType.name : keywordPhrases });

  useEffect(() => {
    dispatch(getDiseasesForSimpleTypeAhead({name: CTK.value}));
  }, [CTK, dispatch]);

  const matchItemToTerm = (item, value) => {
    return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  };

  return (
    <Fieldset
      id="type"
      legend="Cancer Type/Keyword"
      helpUrl="/about-cancer/treatment/clinical-trials/search/help#basicsearch"
    >
      <Autocomplete
        id="ctk"
        label="Cancer Type/Keyword"
        labelHidden
        value={CTK.value}
        inputProps={{ placeholder: 'Start typing to select a cancer type or keyword' }}
        wrapperStyle={{ position: 'relative', display: 'inline-block' }}
        items={diseases}
        inputHelpText="Leave blank to search all cancer types or keywords."
        getItemValue={item => item.name}
        shouldItemRender={matchItemToTerm}
        sortItems={sortItemsByName}
        onChange={(event, value) => {
          setCTK({ value });
          handleUpdate('cancerType', {name: '', codes: []})
          handleUpdate('keywordPhrases', value);
          handleUpdate('typeCode', {});
          handleFormStoreTracking( event, false, '' );
        }}
        onSelect={(value, item) => {
          setCTK({ value });
          handleUpdate('cancerType', item);
          handleUpdate('keywordPhrases', '');
        }}
        renderMenu={children => (
          <div className="cts-autocomplete__menu --q">
            {children.length ? (
                  children
                ) : (
                  <div className="cts-autocomplete__menu-item">
                    No available options found.  Your search will be based on the text above.
                  </div>
                )}
          </div>
        )}
        renderItem={(item, isHighlighted) => (
          <div
            className={`cts-autocomplete__menu-item ${
              isHighlighted ? 'highlighted' : ''
            }`}
            key={item.codes[0]}
          >
            {item.name}
          </div>
        )}
      />
    </Fieldset>
  );
};

export default CancerTypeKeyword;
