
/**
 * The types of events that can be dispatched
 */
export const EVENT_TYPES = {
  Link: 'LINK',
  Load: 'LOAD'
}

/**
 * Gets the prop62 and evar62 contents
 *
 * This outputs the strinf "Clinical Trials: {PageType}"
 * evar62: "Clinical Trials: {PageType}"
 *   - PageType is dependent on whether a basic search or advanced search was performed.
 *     - On the basic form: "Basic"
 *     - On the Results or Details pages, coming from a basic search: "Basic"
 *     - On the advanced form: "Advanced"
 *     - On the Results or Details pages, coming from an advanced search: "Advanced"
 *     - On the Results or Details pages, coming from neither search (a direct link without the rl URL param): "Unknown"
 *     - If from a redirect (redirect URL param is true): "Custom"
 *
 * @param {string} formType - The form type
 */
export const get62Contents = (formType) => {
  switch (formType) {
    case "basic": return 'Clinical Trials: Basic'
    case "advanced": return 'Clinical Trials: Advanced'
    // This should only be for links to description pages
    // from dynamic linking.
    case "custom": return 'Clinical Trials: Custom'
    // This should only work right for google links going
    // directly to the description page.
    default: return "Clinical Trials: Direct"
  }
}

// Analytics use lots of letters, well, mainly the query
// params, in order to track field usage. This is the
// lookup for app data field -> key.
export const FIELD_TO_KEY_MAP = {
  // We removed gender, so no longer tracking it either
  cancerType: "t", subtypes: "st", stages: "stg", findings: "fin",
  age: "a", keywordPhrases: "q", location: "loc", vaOnly: "va",
  zip: "z", zipRadius: "zp", country: "lcnty", states: "lst",
  city: "lcty", hospital: "hos", nihOnly: "nih", healthyVolunteers: "hv",
  trialTypes: "tt", drugs: "d", treatments: "i", trialPhases: "tp",
  trialId: "tid", investigator: "in", leadOrg: "lo",
};

// There are events that can be called across multiple pages,
// so we are going to put those here.
export const CommonAnalyticsActions = {};

CommonAnalyticsActions.load_error_page = (data) => {
  return [{
    type: EVENT_TYPES.Link,
    data: {
      events: [41],
      eVars: { 
        '47': `clinicaltrials_direct`,
        '62': get62Contents('')
      },
      props: {
        '74': `clinicaltrials_direct|error`,
        '75': `apperror|invalidparams`,
        '62': get62Contents('')
      }
    }
  }];
}

CommonAnalyticsActions.link_start_over_link = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;

  return [{
    type: EVENT_TYPES.Link,    
    data: {
      linkname: 'CTStartOverClick',
      events: [49],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },      
      props: {
        '74': `${searchForm}|start over`
      }
    }
  }];
};

CommonAnalyticsActions.link_modify_search_criteria_link = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;

  return [{
    type: EVENT_TYPES.Link,    
    data: {
      linkname: 'CTSModifyClick',
      events: [49],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `${searchForm}|modify`
      }
    }
  }];
};

CommonAnalyticsActions.link_try_a_new_search_link = (data) => {
  const searchForm = `clinicaltrials_${data.formType}`;

  return [{
    type: EVENT_TYPES.Link,    
    data: {
      linkname: 'CTSTryNewSearchClick',
      events: [49],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `${searchForm}|try a new search`
      }
    }
  }];
};