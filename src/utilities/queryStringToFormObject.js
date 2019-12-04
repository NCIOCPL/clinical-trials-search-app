import * as queryString from 'query-string';
import {defaultState} from '../store/reducers/form';
import {resolveConcepts} from './resolveConcepts';
import {getStateNameFromAbbr} from './getStateNameFromAbbr';
import { upper } from 'change-case';

const VALID_CCODE_REGEX = /c\d+/i;
const VALID_ZIPCODE_REGEX = /^\d{5}$/;

const MAX_AGE = 120;

// The allowed concept types for the disease
// fields on the two forms
const ALLOWED_BASIC_DISEASES = {
  'cancerType': ['maintype', 'subtype', 'stage']
};
const ALLOWED_ADVANCED_DISEASES = {
  'cancerType': ['maintype'],
  'subtypes': ['subtype'],
  'stages': ['stage'],
  'findings': ['finding']
};
const ALLOWED_ADVANCED_INTERVENTIONS = {
  'drugs': ['agent', 'agent category'],
  'treatments': ['other', 'none']
}


/**
 * Maps query parameters to an object that can be used to update
 * the form store.
 *
 * @param {string} urlQuery - the query string to parse
 * @param {function} diseaseFetcher - the function to fetch a list of diseases
 * @param {function} interventionsFetcher - the function to fetch a list of interventions
 * @param {function} zipcodeFetcher - the function to fetch a zip code
 */
export const queryStringToFormObject = async (urlQuery, diseaseFetcher, interventionsFetcher, zipcodeFetcher) => {

  // Setup the two items we will be modifying throughout the parsing.
  let rtnErrorsList = [];
  let rtnFormState = { ...defaultState };

  const query = queryString.parse(urlQuery, {
    parseBooleans: true,
    // Treating zipcodes as numbers will really cause issues.
    parseNumbers: false,
    // Note: any text fields need to be rejoined!
    arrayFormat: 'comma'
  });

  // All parameters need to be processed even if there is an
  // error. This is so we can report ALL **FIELDS** that have
  // errors to the user. So be smart about if you need to
  // actually need to access that API...

  /**************************
   * MUST HAVE VALID RL PARAM TO CONTINUE
   * (some fields need to know which one)
   **************************/
  if (query['rl']) {
    if (query['rl'] === "2") {
      rtnFormState = {
        ...rtnFormState,
        formType: "advanced"
      }
    } else if (query['rl'] !== "1") {
      // HARD STOP. BAIL. DO NOT PASS GO.
      return {
        formState: null,
        errors: [{ 
          fieldName: "formType",
          message: "Results Link Flag can only equal 1 or 2."
        }]
      };
    } // Default is basic, aka 1
  }

  /*************************
   * Handle simple fields
   *************************/

  // Age 
  if (query['a']) {
    const age = parseInt(query['a']);
    if (Number.isNaN(age) || age < 0 || age > MAX_AGE) {
      rtnErrorsList.push({
        fieldName: "age",
        message: "Please enter a valid age parameter.",
      })
    } else {
      rtnFormState = {
        ...rtnFormState,
        age
      };
    }
  }

  // Phrases / Keyword
  if (query['q']) {
    // URL parsing will split params into an array on commas.
    // string param needs to rejoin.
    const phrase = Array.isArray(query['q']) ? query['q'].join(',') : query['q'];
    rtnFormState = {
      ...rtnFormState,
      keywordPhrases: phrase
    }
  }

  // Lead Org
  if (query['lo']) {
    // URL parsing will split params into an array on commas.
    // string param needs to rejoin.
    const leadOrg = Array.isArray(query['lo']) ? query['lo'].join(',') : query['lo'];
    rtnFormState = {
      ...rtnFormState,
      leadOrg: {term: leadOrg, termKey: leadOrg}
    }
  }

  // Principal Investigator
  if (query['in']) {
    // URL parsing will split params into an array on commas.
    // string param needs to rejoin.
    const pi = Array.isArray(query['in']) ? query['in'].join(',') : query['in'];
    rtnFormState = {
      ...rtnFormState,
      investigator: { term: pi, termKey: pi}
    }
  }

  // Trial ID
  if (query['tid']) {
    // URL parsing will split params into an array on commas.
    // string param needs to rejoin.
    const ids = Array.isArray(query['tid']) ? query['tid'].join(',') : query['tid'];
    rtnFormState = {
      ...rtnFormState,
      trialId: ids
    }
  }

  // Healthy Volunteers
  if (query['hv']) {
    const healthy = parseInt(query['hv']);
    if (healthy === 1) {
      rtnFormState = {
        ...rtnFormState,
        healthyVolunteers: true
      };
    } else {
      rtnErrorsList.push(makeError(
        "healthyVolunteers",
        "Please enter a valid healthy volunteer indicator."
      ));
    }
  }

  // Trial Types and Phases
  const [typeFormState, typeErrorsList] = processChecklistField(query['tt'], 'trialTypes');

  // Add form state
  rtnFormState = {
    ...rtnFormState,
    ...typeFormState
  }

  // Add Errors
  rtnErrorsList = [
    ...rtnErrorsList,
    ...typeErrorsList
  ];

  const [phasesFormState, phasesErrorsList] = processChecklistField(query['tp'], 'trialPhases');
  // Add form state
  rtnFormState = {
    ...rtnFormState,
    ...phasesFormState
  }

  // Add Errors
  rtnErrorsList = [
    ...rtnErrorsList,
    ...phasesErrorsList
  ];

  /************************
   * Locations
   ************************/
  
  // This needs 2 passes when it is zipcode. So let's
  // treat any location search as a zip code search and
  // defer the setting of formState until after our
  // zipcode lookup function is called. (It does not
  // need to actually call the API for any other
  // locations...)
  
  const [queryLocationsPass1, locationErrorsPass1] = processLocationsPass1(query, rtnFormState.formType);
  
  // Add in errors for pass 1.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...locationErrorsPass1
  ];

  /*************************
   * Diseases and Interventions
   *************************/

  // We must make two passes with diseases and interventions:
  // 1. To convert the query string into a list of IDs and
  //    make sure they are valid.
  // 2. To fetch the concepts and validate they exist and
  //    are appropriate for that field.
  //
  // Pass 1 can fail if the ids are not the correct format.
  // Pass 2 can fail if the concept is not in the list of
  // fetched concepts. (e.g. a disease cannot be found)
  // for diseases, we also need to make sure that on the
  // advanced form 

  // Get diseases for pass 1.
  const [queryDiseasesPass1, diseaseErrorsPass1] = processDiseasesPass1(query);

  // Add in disease errors for pass 1.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...diseaseErrorsPass1
  ];

  // Get interventions for pass 1.
  const [queryInterventionsPass1, interventionErrorsPass1] = processInterventionsPass1(query);

  // Add in disease errors for pass 1.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...interventionErrorsPass1
  ];
  
  // Now that we know what requests to make
  const [diseaseResults, interventionResults, locationResults] = await Promise.all([
    resolveConcepts(queryDiseasesPass1, diseaseFetcher),
    resolveConcepts(queryInterventionsPass1, interventionsFetcher),
    resolveLocations(queryLocationsPass1, zipcodeFetcher)
  ]);

  // Process locations for pass 2. So processLocationsPass2 does not really
  // do much processing unless it was a zip code search.
  const [queryLocationsPass2, locationErrorsPass2] = processLocationsPass2(locationResults);
  // Add in correct locations from pass 2.
  rtnFormState = {
    ...rtnFormState,
    ...queryLocationsPass2
  }

  // Add in location errors for pass 2.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...locationErrorsPass2
  ];


  // Get diseases for pass 2.
  const [queryDiseasesPass2, diseaseErrorsPass2] = processDiseasesPass2(diseaseResults, rtnFormState.formType);

  // Add in correct concepts from pass 2.
  rtnFormState = {
    ...rtnFormState,
    ...queryDiseasesPass2
  }

  // Add in disease errors for pass 2.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...diseaseErrorsPass2
  ];

  // Get Interventions for pass 2.
  const [queryInterventionsPass2, interventionErrorsPass2] = processInterventionsPass2(interventionResults);

  // Add in correct concepts from pass 2.
  rtnFormState = {
    ...rtnFormState,
    ...queryInterventionsPass2
  }

  // Add in intervention errors for pass 2.
  rtnErrorsList = [
    ...rtnErrorsList,
    ...interventionErrorsPass2
  ];

  return {
    formState: (rtnErrorsList.length > 0) ? null : rtnFormState,
    errors: rtnErrorsList
  };

};

/**
 * I keep messing up the structure. So here is a helper.
 * @param {string} fieldName - the name of the field.
 * @param {string} message - the message
 */
const makeError = (fieldName, message) => {
  return {
    fieldName,
    message
  };
};

/**
 * Handles processing of the URL to setup pass 2 which
 * *could* fetch a zip code.
 * @param {object} query - dictionary of url params
 */
const processLocationsPass1 = (query, formType) => {
  let queryLocations = {};
  let rtnErrorsList = [];

  if (!query['loc']) {
    // Get out of here early so we don't need to indent
    // everything.
    return [queryLocations, rtnErrorsList];
  }

  // Parse loc as an int.
  const locInt = parseInt(query['loc']);

  // If the query is 0, then it is the default, and we
  // can just return nothing.
  if (locInt === 0) {
    return [queryLocations, rtnErrorsList];
  }

  if (formType !== 'advanced' && locInt !== 1) {
    // This is a basic search that is not using a zipcode search. Doing this here
    // means that the switch below will never have any incorrect basic/location
    // combinations.
    rtnErrorsList.push(makeError("location", "Please enter a valid location type."))
  } else {
    // Switch on the location to setup a location object.
    switch (locInt) {
      case 1: {
        [queryLocations, rtnErrorsList] = processLocationsZip(query);
        break;
      }
      case 2: {
        [queryLocations, rtnErrorsList] = processLocationsCountry(query);
        break;
      }
      case 3: {
        [queryLocations, rtnErrorsList] = processLocationsInstitutions(query);
        break;
      }
      // At NIH
      case 4: {
          queryLocations = {
            ...queryLocations,
            location: 'search-location-nih'
          }
        break;
      }
      default: {
        rtnErrorsList.push(makeError("location", "Please enter a valid location type."))
      }
    }
  }
  return [queryLocations, rtnErrorsList];
};

/**
 * Processes Hospital/Institutions for pass 1. 
 * We know this is a hospital search by this point.
 * @param {object} query 
 */
const processLocationsInstitutions = (query) => {
  let queryLocations = {};
  let rtnErrorsList = [];

  if (!query['hos']) {
    // Hospital is missing
    rtnErrorsList.push(makeError("hospital", "Please enter a valid hospital."))
  } else {
    const hospital = Array.isArray(query['hos']) ? query['hos'].join(',') : query['hos'];
    queryLocations = {
      hospital: {term: hospital, termKey: hospital},
      location: 'search-location-hospital'
    }
  }

  return [queryLocations, rtnErrorsList];
}

/**
 * Processes Country/City/State locations for pass 1.
 */
const processLocationsCountry = (query) => {
  let queryLocations = {};
  let rtnErrorsList = [];

  if (!query['lcnty']) {
    // No country, no location.
    rtnErrorsList.push(makeError('country','Please enter a country.'));
  } else {
    // Extract country
    queryLocations = {
      ...queryLocations,
      country: Array.isArray(query['lcnty']) ? query['lcnty'].join(',') : query['lcnty'],
      location: 'search-location-country'
    };
    
    // Extract city, this is no biggie
    if (query['lcty']) {
      queryLocations = {
        ...queryLocations,
        city: Array.isArray(query['lcty']) ? query['lcty'].join(',') : query['lcty']
      };  
    }

    // Extract state. This needs to A) be the US, and B) be in the valid states list.
    if (query['lst']) {
      if (queryLocations.country !== "United States") {
        rtnErrorsList.push(makeError('states','State with non-US Country Invalid.'));
      } else {
        const states = (Array.isArray(query['lst']) ? query['lst'] : [query['lst']])
                        .map(st => {
                          const upperAbbr = st.toUpperCase();
                          const matchedName = getStateNameFromAbbr(upperAbbr);
                          
                          if (matchedName) {
                            return {abbr: upperAbbr, name: matchedName};
                          } else {
                            return upperAbbr;
                          }
                        });
        // There is still a string, then it is a bad state.
        if (states.find(st => typeof st === 'string')) {          
          rtnErrorsList.push(makeError('states','Unknown State.'));
        } else {
          queryLocations = {
            ...queryLocations,
            states: states
          };
        }
      }      
    }
  }

  // Clear out query locations if there are errors and return.
  return [rtnErrorsList.length === 0 ? queryLocations : {}, rtnErrorsList];
}

/**
 * Processes zip code locations for pass 1.
 * @param {*} query 
 */
const processLocationsZip = (query) => {
  let queryLocations = {};
  let rtnErrorsList = [];

  if (!query['z'] || Array.isArray(query['z']) || !query['z'].match(VALID_ZIPCODE_REGEX)) {
    rtnErrorsList.push(makeError('zip','Invalid Parameter'));
  } else {
    queryLocations = {
      zip: query['z'],
      location: 'search-location-zip'
    }
  }

  if (query['zp']) {
    const proximity = parseInt(query['zp']);
    if (Number.isNaN(proximity) || proximity < 1) {
      rtnErrorsList.push(makeError('zipRadius','Invalid Parameter'));
    } else {
      queryLocations = {
        ...queryLocations,
        zipRadius: proximity
      }
    }
  }

  return [rtnErrorsList.length === 0 ? queryLocations : {}, rtnErrorsList];
}


/**
 * Pass 2 for locations.
 * @param {object} locationResults - the populated location fields 
 */
const processLocationsPass2 = (locationResults) => {
  let queryLocation = {};
  let rtnErrorsList = [];

  if (locationResults.location !== 'search-location-zip') {
    // this is a passthrough for the location parameters
    queryLocation = locationResults;
  } else {
    if (!locationResults.zipCoords) {
      rtnErrorsList.push(makeError("zipCoords", "Invalid Coordinates"));
    } else {
      queryLocation = locationResults;
    }
  }

  return [queryLocation, rtnErrorsList];
}

/**
 * Function handles the extraction of disease parameters,
 * validates them, and makes the object needed for pass 2
 * of the API query.
 * @param {object} query - the dictionary of query params
 */
const processDiseasesPass1 = query => {
  let queryDiseases = {};
  let rtnErrorsList = [];

  // Setup this helper function so that we do not have to
  // duplicate this code. This modifies queryDiseases and
  // rtnErrorsList.
  const diseaseFieldHandler = (queryParam, fieldName) => {
    // Pre process the results
    const result = processConceptField(queryParam, fieldName)

    // The field is bogus
    if (result['errors']) {
      rtnErrorsList = [
        ...rtnErrorsList,
        ...result['errors']
      ];
    } else if (result['concepts'].length > 0) {
      // We have a good list of ids. Queue them up for
      // fetching.
      queryDiseases = {
        ...queryDiseases,
        [fieldName]: result['concepts']
      }
    }
  };

  // cancertType
  if (query['t']) {
    // Cancer type only allows 1 concept
    if (Array.isArray(query['t']) && query['t'].length > 1) {
      rtnErrorsList.push(makeError("cancerType", "Please include only one main cancer type in your search."));
    } else {
      diseaseFieldHandler(query['t'], 'cancerType');
    }
  }
  // Subtype
  if (query['st']) {
    diseaseFieldHandler(query['st'], 'subtypes');
  }
  // Stages
  if (query['stg']) {
    diseaseFieldHandler(query['stg'], 'stages');
  }
  // Stages
  if (query['fin']) {
    diseaseFieldHandler(query['fin'], 'findings');
  }

  return [ queryDiseases, rtnErrorsList ];
};

/**
 * Pass 2 of diseases. Finding errors.
 * @param {object} diseaseResults
 * @param {string} formType
 */
const processDiseasesPass2 = (diseaseResults, formType) => {
  let rtnFormState = {};
  let rtnErrorsList = [];
  // Now do the second pass for the diseases
  for (const [fieldName, selectedConcepts] of Object.entries(diseaseResults)) {

    // If this field has *any* selected concept that is UNKNOWN, then the
    // ids are bad and the entire field fails.
    if (selectedConcepts.find(concept => concept.name === 'UNKNOWN')) {
      rtnErrorsList.push(makeError(fieldName, "Unknown disease ID"));
    } else {

      // Now we need to see if we are an allowed type
      const allowedTypes = formType === 'advanced' ?
                           ALLOWED_ADVANCED_DISEASES[fieldName] :
                           ALLOWED_BASIC_DISEASES[fieldName];

      // Find any concepts that do not have an allowed type.
      const badType = selectedConcepts.find(concept => {
        const intersection = allowedTypes.filter(type => concept.type.includes(type));
        return (intersection.length === 0);
      });
      
      if (badType) {
        rtnErrorsList.push(makeError(fieldName, "Incorrect disease type"));
      } else {
        rtnFormState = {
          ...rtnFormState,
          [fieldName]: (fieldName === 'cancerType') ? selectedConcepts[0] : selectedConcepts
        };
      }
    }
  }

  return [rtnFormState, rtnErrorsList];
};

/**
 * Function handles the extraction of intervention parameters,
 * validates them, and makes the object needed for pass 2
 * of the API query.
 * @param {object} query - the dictionary of query params
 */
const processInterventionsPass1 = query => {
  let queryInterventions = {};
  let rtnErrorsList = [];

  // Setup this helper function so that we do not have to
  // duplicate this code. This modifies queryInterventions and
  // rtnErrorsList.
  const interventionsFieldHandler = (queryParam, fieldName) => {
    // Pre process the results
    const result = processConceptField(queryParam, fieldName)

    // The field is bogus
    if (result['errors']) {
      rtnErrorsList = [
        ...rtnErrorsList,
        ...result['errors']
      ];
    } else if (result['concepts'].length > 0) {
      // We have a good list of ids. Queue them up for
      // fetching.
      queryInterventions = {
        ...queryInterventions,
        [fieldName]: result['concepts']
      }
    }
  };

  // Drug
  if (query['d']) {
    interventionsFieldHandler(query['d'], 'drugs');
  }
  // Other treatment
  if (query['i']) {
    interventionsFieldHandler(query['i'], 'treatments');
  }

  return [ queryInterventions, rtnErrorsList ];
};

/**
 * Pass 2 of diseases. Finding errors.
 * @param {*} interventionResults 
 */
const processInterventionsPass2 = (interventionResults) => {
  let rtnFormState = {};
  let rtnErrorsList = [];
  // Now do the second pass for the interventions
  for (const [fieldName, selectedConcepts] of Object.entries(interventionResults)) {

    // If this field has *any* selected concept that is UNKNOWN, then the
    // ids are bad and the entire field fails.
    if (selectedConcepts.find(concept => concept.name === 'UNKNOWN')) {
      rtnErrorsList.push(makeError(fieldName, "Unknown intervention ID"));
    } else {

      // Now we need to see if we are an allowed type
      const allowedCats = ALLOWED_ADVANCED_INTERVENTIONS[fieldName];

      // Find any concepts that do not have an allowed category.
      const badType = selectedConcepts.find(concept => {
        const intersection = allowedCats.filter(type => concept.category.includes(type));
        return (intersection.length === 0);
      });

      if (badType) {
        rtnErrorsList.push(makeError(fieldName, "Incorrect intervention category"));
      } else {
        rtnFormState = {
          ...rtnFormState,
          [fieldName]: selectedConcepts
        };
      }            
    }
  }

  return [rtnFormState, rtnErrorsList];
};


/**
 * Initial processor for handling concept fields (diseases and interventions)
 * @param {string|array} queryParam - the query param to process
 * @param {string} fieldName - the name of the form store field
 */
const processConceptField = (queryParam, fieldName) => {

  // Make ids an array if it is 1 single param.
  const ids = (typeof queryParam === 'string') ? [queryParam] : queryParam;

  // This field contains an id that is invalid.
  const badelement = ids.find(id => !id.match(VALID_CCODE_REGEX));
  if (badelement) {
    return {
      errors: [makeError(fieldName, "Please enter a valid parameter")]
    }
  }

  return {
    concepts: toConceptsList(ids)
  };
};


/**
 * Converts a queryparms string into a concept list.
 * @param {string} contents - the contents of the query param
 */
const toConceptsList = contents => {
  const concepts = contents
    .map(
      concept => ({
        name: 'UNKNOWN',
        codes: concept.split("|"),
        types: []
      })
    );
  return concepts;
};

const processChecklistField = (queryParam, fieldName) => {
  let rtnFormState = {};
  let rtnErrorsList = [];

  if (queryParam) {
    const selectedOptions = (Array.isArray(queryParam) ? queryParam : [queryParam])
                      .map(selectedOption => selectedOption.toLowerCase());

    // Now we need to find bad selected ID.
    const possibleValues = defaultState[fieldName]
                          .map(option => option.value.toLowerCase());
    const badSelections = selectedOptions.filter(selectedOption => !possibleValues.includes(selectedOption));

    if (badSelections.length > 0) {
      rtnErrorsList.push(makeError(
        fieldName,
        "Invalid selection"
      ));
    } else {
      // Now that the list looks good
      rtnFormState = {
        ...rtnFormState,
        [fieldName]: defaultState[fieldName].map(option => ({
          ...option,
          checked: selectedOptions.includes(option.value)
        }))
      };
    }
  }

  return [rtnFormState, rtnErrorsList];
};

const resolveLocations = async (query, zipcodeFetcher) => {
  // We need to see if this is zip code search
  // replace the geo-coordinates if match
  // set geo-coordinate as what on failure?
  if (query.location !== 'search-location-zip') {
    return query;
  }

  // This is a zip, so let's go fetch. Also, the
  // zip would not be set if it were all invalid,
  // so we are good to go.
  const zipResult = await zipcodeFetcher(query.zip);

  if (zipResult) {
    return {
      ...query,
      zipCoords: zipResult
    }
  } else {
    // We will return the query without coords filled in. The
    // 2nd pass processor will check if the coordinates are
    // filled in.
    return query;
  }
}
