import { get62Contents, EVENT_TYPES, FIELD_TO_KEY_MAP } from './cts-analytics-common';

/**********************
 * DO NOT COPY ABOVE THIS LINE
 **********************/


export const ResultsAnalyticsActions = {};

//------------------
// Results events
//------------------

// Only modern browsers guarantee key order so let's be sure
// and use an array since order will matter in results list.
const ADV_FIELD_ORDER = [
  "cancerType", "subtypes", "stages", "findings", "age",
  "keywordPhrases", "location", "vaOnly", "zip", "zipRadius",
  "country", "states", "city", "hospital", "nihOnly",
  "trialTypes", "drugs", "treatments", "healthyVolunteers",
  "trialPhases", "trialId", "investigator", "leadOrg"
]

const BASIC_FIELD_ORDER = [
  "cancerType", "age", "keywordPhrases", "location", "zip"
]


// This maps the location search type to the shortend tracking
// key.
const LOCATION_TRACK_KEYS = {
  'search-location-all': 'all', 'search-location-zip': 'zip',
  'search-location-hospital': 'hi', 'search-location-nih': 'At NIH',
  'search-location-country': 'csc'
}

const TRIAL_TYPE_MAP = {
  'treatment': "tre",
  'prevention': "pre",
  'supportive_care': "sup",
  'health_services_research': "hea",
  'diagnostic': "dia",
  'screening': "scr",
  'basic_science': "bas",
  'other': "oth"
}

const TRIAL_TYPE_ORDER = [
  'treatment', 'supportive_care', 'diagnostic', 'basic_science',
  'prevention', 'health_services_research', 'screening', 'other'
];

/**
 * Gets the string for a multicode field like
 * stage, or drug.
 * @param {*} fieldName 
 * @param {*} formData 
 */
const getMultiCodeField = (fieldName, formData, unsetTxt = 'all') => {
  return formData[fieldName] ?
    (
      formData[fieldName].length >= 5 ?
      'more than 5' :
      // Note these fields are multidimensional arrays of C-Codes
      formData[fieldName].reduce((ac,codesArr) =>{
          return [
            ...ac,
            ...codesArr
          ];
        },[])
        .map(id => id.toLowerCase()).join(',')
    ) : unsetTxt;
};

/**
 * Maps a list of trial types to their short codes, in order.
 * @param {*} trialTypes 
 */
const mapTrialTypeCodes = (trialTypes) => {
  if (!trialTypes || trialTypes.length === 0) {
    return 'all';
  }

  return TRIAL_TYPE_ORDER.reduce( (ac, type) => {
    if (trialTypes.includes(type)) {
      return [
        ...ac,
        TRIAL_TYPE_MAP[type]
      ]
    }
    return ac;
  },[]).join(',');
};

/**
 * This is for prop18
 * @param {*} data 
 */
const locationSearchParams = (data) => {
  const formData = data.formData ? data.formData : {};

  switch(formData['location']) {
    case 'search-location-zip' : {
      if (data.formType === 'basic') {
        return `zip|${formData['zip']}|none`
      } else {
        const zipStr = `zip|${formData['zip']}|${formData['zipRadius']}`;
        return (formData['vaOnly']) ? zipStr + '|va-only' : zipStr;
      }
    }
    case 'search-location-country' : {      
      // Country should never not exist, but just in case we don't want
      // errors breaking the app.
      const country = formData['country'] ? formData['country'].toLowerCase() : 'none';
      const states = formData['states'] ? formData['states'].map(st => st.toLowerCase()).join(',') : 'none';
      const city = formData['city'] ? formData['city'].toLowerCase() : 'none';

      if (formData['vaOnly']) {
        return `csc|${country}|${states}|${city}|va-only`;
      } else {
        return `csc|${country}|${states}|${city}`;
      }
    }
    case 'search-location-hospital' : {
      return `hi|${formData['hospital']}`;
    }
    case 'search-location-nih' : {
      return 'at nih';
    }
    case 'search-location-all' : 
    default: {
      if (data.formType === 'basic' || !formData['vaOnly']) {
        return 'all';
      } else {
        return 'all|va-only'
      }  
    }

  }

}

/**
 * Handles parsing of search params for advanced form.
 * (This is complicated enough that if basic/adv then, blah
 * checks were making it unreadable)
 * @param {*} data 
 */
const searchParamsAdvanced = (data) => {
  const formData = data.formData ? data.formData : {};

  /******
   * PROP 15: Field Usage (Basic differs from Advanced)
   ******/
  const searchParamKeys = ADV_FIELD_ORDER
    .reduce((ac, fieldName) => {
      if (formData[fieldName] && fieldName !== 'location') {
        ac = [
          ...ac,
          FIELD_TO_KEY_MAP[fieldName]
        ]
      } else if (fieldName === 'location' && 
        (
          formData['location'] !== 'search-location-all' ||
          formData['vaOnly']
        )
      ) {
          ac = [
            ...ac,
            FIELD_TO_KEY_MAP['location']
          ]
      }
      return ac;
    }, [])
    .join(':');

  /******
   * Prop 17: Basic Form Data
   ******/
  const ct = formData['cancerType'] ?
    formData['cancerType'].map(code => code.toLowerCase()).join(',') :
    'all';
  const st = getMultiCodeField('subtypes', formData);
  const stg = getMultiCodeField('stages', formData);
  const fin = getMultiCodeField('findings', formData);
  const age = formData['age'] ? formData['age']: 'none';
  const kw = formData['keywordPhrases'] ? formData['keywordPhrases'].toLowerCase() : 'none';

  const prop17 = `${ct}|${st}|${stg}|${fin}|${age}|${kw}`;

  /******
   * Prop 19: Other fields pt 1
   ******/

  const tt = mapTrialTypeCodes(formData['trialTypes']);
  const drug = getMultiCodeField('drugs', formData, 'none');
  const treat = getMultiCodeField('treatments', formData, 'none');
  //all|none|none'
  //all|none|none|hv'
  const prop19 = formData['healthyVolunteers'] ?
    `${tt}|${drug}|${treat}|hv` :
    `${tt}|${drug}|${treat}`;
  
  /******
   * Prop 20: Other fields pt 2
   ******/
  
  //'all|none|none|none',   
  const tp = formData['trialPhases'] ? formData['trialPhases'].join(',') : 'all';
  const tid = formData['trialId'] ?
    (
      formData['trialId'].includes(',') ?
        `multiple:${formData['trialId'].toLowerCase()}` :
        `single:${formData['trialId'].toLowerCase()}`
    ) : 'none';
  const inv = formData['investigator'] ? formData['investigator'].toLowerCase() : 'none';
  const lo = formData['leadOrg'] ? formData['leadOrg'].toLowerCase() : 'none';
  const prop20 = `${tp}|${tid}|${inv}|${lo}`;

  return {
    eVars: {
      '15': (searchParamKeys !== '') ? searchParamKeys : 'none',
      '17': prop17,
      '18': locationSearchParams(data),
      '19': prop19,
      '20': prop20,
    },
    props: {
      '15': (searchParamKeys !== '') ? searchParamKeys : 'none',
      '17': prop17,
      '18': locationSearchParams(data),
      '19': prop19,
      '20': prop20,
    },
  }
  
}

/**
 * Handles parsing of search params for basic form.
 * (This is complicated enough that if basic then, blah
 * checks were making it unreadable)
 * @param {*} data 
 */
const searchParamsBasic = (data) => {
  const formData = data.formData ? data.formData : {};

  /******
   * PROP 15: Field Usage (Basic differs from Advanced)
   ******/
  const searchParamKeys = BASIC_FIELD_ORDER
    .reduce((ac, fieldName) => {
      if (formData[fieldName] && fieldName !== 'location') {
        ac = [
          ...ac,
          FIELD_TO_KEY_MAP[fieldName]
        ]
      } else if (fieldName === 'location' && formData['location'] === 'search-location-zip') {
          ac = [
            ...ac,
            FIELD_TO_KEY_MAP['location']
          ]
      }
      return ac;
    }, [])
    .join(':');

  /******
   * Prop 17: Basic Form Data
   ******/
  const prop17Main = formData['cancerType'] ?
    'typecondition|' + formData['cancerType'].map(code => code.toLowerCase()).join(',') : 
    (
      formData['keywordPhrases'] ?
      'keyword|' + formData['keywordPhrases'].toLowerCase() :
      'none'
    );
  const prop17Age = formData['age'] ?
      formData['age'] :
      'none';

  /******
   * Prop 18: Location
   ******/
  

  return {
    eVars: {
      '15': (searchParamKeys !== '') ? searchParamKeys : 'none',
      '17': prop17Main + '|' + prop17Age,
      '18': locationSearchParams(data)
    },
    props: {
      '15': (searchParamKeys !== '') ? searchParamKeys : 'none',
      '17': prop17Main + '|' + prop17Age,
      '18': locationSearchParams(data)
    },
  }

}


ResultsAnalyticsActions.load_results = (data) => {

  const searchFormParams = data.formType === 'advanced' ?
    searchParamsAdvanced(data) :
    searchParamsBasic(data);

  const trackData = {
    events: [ 2 ],
    eVars: {
      ...searchFormParams.eVars,
      '10': data.numResults,
      '11': `clinicaltrials_${data.formType}`,
      '62': get62Contents(data.formType)
    },
    // Prop44 comes from elsewhere, so not including.
    props: {
      ...searchFormParams.eVars,
      '11': `clinicaltrials_${data.formType}`,
      '62': get62Contents(data.formType),
    }
  };

  return [{
    type: EVENT_TYPES.Load,
    data: trackData
  }];
};

// Clicking on a result in the results pages.
ResultsAnalyticsActions.link_results_page_link = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;
  const rank = `${data.resultsPosition}|page ${data.pageNum}`;

  return [{
    type: EVENT_TYPES.Link,
    data: {
      events: [42],
      props: {
        '12': searchForm,
        '13': rank
      },
      eVars: {
        '12': searchForm
      }
    }
  }];
};

ResultsAnalyticsActions.link_print_selected_button = (data) => {
  const location = data.buttonPos;
  const selectAllText = data.selectAll ? "selectall" : "noselectall";
  const totalChecked = data.selectedCount;
  const checkedPages = data.pagesWithSelected ? data.pagesWithSelected.join(',') : '';
  const searchForm = `clinicaltrials_${data.formType}`;

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: 'CTSResultsPrintSelectedClick',
      events: [48],
      props: {
        '21': `CTSPrintSelected_${location}_${selectAllText}_${totalChecked}_${checkedPages}`,
        '74': `${searchForm}|print selected`
      }
    }
  }];
};

ResultsAnalyticsActions.link_print_selected_none_selected_button = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: 'CTSResultsSelectedErrorClick',
      events: [41],
      props: {
        '74': `${searchForm}|error`,
        '75': 'printselected|noneselected',
      }
    }
  }];
};

ResultsAnalyticsActions.link_print_selected_max_reached_button = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;
 
  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: 'CTSResultsSelectedErrorClick',
      events: [41],
      props: {
        '74': `${searchForm}|error`,
        '75': 'printselected|maxselectionreached',
      }
    }
  }];
}
