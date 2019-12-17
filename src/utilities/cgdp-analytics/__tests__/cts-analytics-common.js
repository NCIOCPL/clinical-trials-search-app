import {CommonAnalyticsActions, get62Contents} from '../cts-analytics-common';

const TEST_CASES = [
  // Error page load
  [ "load_error_page",
    "Error page",
    {},
    [{
      type: "LINK",
      data: {        
        events: [41],
        eVars: { 
          '47': `clinicaltrials_direct`,
          '62': 'Clinical Trials: Direct'
        },
        props: {
          '74': `clinicaltrials_direct|error`,
          '75': `apperror|invalidparams`,
          '62': 'Clinical Trials: Direct'
        }
      }
    }]
  ],
  // Start Over
  [ "link_start_over_link",
    "basic works",
    {
      formType: 'basic'
    },
    [{
      type: "LINK",      
      data: {
        linkname: "CTStartOverClick",
        events: [49],
        eVars: { '47': `clinicaltrials_basic` },
        props: {
          '74': `clinicaltrials_basic|start over`
        }
      }
    }]
  ],
  [ "link_start_over_link",
    "adv works",
    {
      formType: 'advanced'
    },
    [{
      type: "LINK",      
      data: {
        linkname: "CTStartOverClick",
        events: [49],
        eVars: { '47': `clinicaltrials_advanced` },
        props: {
          '74': `clinicaltrials_advanced|start over`
        }
      }
    }]
  ],
  // Modify Search
  [ "link_modify_search_criteria_link",
    "basic works",
    {
      formType: 'basic'
    },
    [{
      type: "LINK",      
      data: {
        linkname: "CTSModifyClick",
        events: [49],
        eVars: { '47': `clinicaltrials_basic` },
        props: {
          '74': `clinicaltrials_basic|modify`
        }
      }
    }]
  ],
  [ "link_modify_search_criteria_link",
    "adv works",
    {
      formType: 'advanced'
    },
    [{
      type: "LINK",      
      data: {
        linkname: "CTSModifyClick",
        events: [49],
        eVars: { '47': `clinicaltrials_advanced` },
        props: {
          '74': `clinicaltrials_advanced|modify`
        }
      }
    }]
  ],  
  // Try a new Search (Error page & on 0 results found)
  [ "link_try_a_new_search_link",
    "basic works",
    {
      formType: 'basic'
    },
    [{
      type: "LINK",      
      data: {
        linkname: "CTSTryNewSearchClick",
        events: [49],
        eVars: { '47': `clinicaltrials_basic` },
        props: {
          '74': `clinicaltrials_basic|try a new search`
        }
      }
    }]
  ],
  [ "link_try_a_new_search_link",
    "adv works",
    {
      formType: 'advanced'
    },
    [{
      type: "LINK",
      data: {
        linkname: "CTSTryNewSearchClick",
        events: [49],
        eVars: { '47': `clinicaltrials_advanced` },
        props: {
          '74': `clinicaltrials_advanced|try a new search`
        }
      }
    }]
  ],  

]

describe("CommonAnalyticsActions - Link Tests", () => {
  test.each(TEST_CASES)(
    "%# - %s - %s",
    (actionName, scenario, eventdata, expected) => {
      const actual = CommonAnalyticsActions[actionName](eventdata);
      expect(actual).toEqual(expected);
    }
  );
})
