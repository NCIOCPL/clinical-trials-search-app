import { SearchAnalyticsActions} from '../cts-search-page-analytics';

const TEST_CASES = [
  // PAGE LOAD
  [ "load_basic_search",
    "works",
    {},
    [
      {
        type: 'LOAD',
        data: {
          eVars: { '62': "Clinical Trials: Basic" },
          props: { '62': "Clinical Trials: Basic" }
        }
      },
      {
        type: "LINK",
        data: {
          events: [37],
          eVars: { '47': 'clinicaltrials_basic' },
          props: { '74': 'clinicaltrials_basic|display'}
        }
      }
    ]
  ],
  [ "load_advanced_search",
    "works",
    {},
    [
      {
        type: 'LOAD',
        data: {
          eVars: { '62': "Clinical Trials: Advanced" },
          props: { '62': "Clinical Trials: Advanced" }
        }
      },
      {
        type: "LINK",
        data: {
          events: [37],
          eVars: { '47': 'clinicaltrials_advanced' },
          props: { '74': 'clinicaltrials_advanced|display'}
        }
      }
    ]
  ],
  // Start Event
  [ "link_form_start",
    "basic works",
    {
      formType: 'basic'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_basic|start',
        events: [38],
        eVars: { '47': `clinicaltrials_basic` },
        props: { '74': `clinicaltrials_basic|start`}
      }
    }]
  ],
  [ "link_form_start",
    "adv works",
    {
      formType: 'advanced'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_advanced|start',
        events: [38],
        eVars: { '47': `clinicaltrials_advanced` },
        props: { '74': `clinicaltrials_advanced|start`}
      }
    }]
  ],
  // Validation Error
  //
  [ "link_form_validation_error",
    "basic age",
    {
      formType: 'basic',
      field: 'age',
      message: 'Please enter a number between 1 and 120.'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_basic|error',
        events: [41],
        eVars: {
          '47': `clinicaltrials_basic`
        },
        props: {
          '74': `clinicaltrials_basic|error`,
          '75': 'a|Please enter a number between 1 and 120.'
        }
      }
    }]
  ],
  [ "link_form_validation_error",
    "adv age",
    {
      formType: 'advanced',
      field: 'age',
      message: 'Please enter a number between 1 and 120.'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_advanced|error',
        events: [41],
        eVars: {
          '47': `clinicaltrials_advanced`
        },
        props: {
          '74': `clinicaltrials_advanced|error`,
          '75': 'a|Please enter a number between 1 and 120.'
        }
      }
    }]
  ],
  [ "link_form_validation_error",
    "adv zip",
    {
      formType: 'advanced',
      field: 'zip',
      message: 'Please enter a valid 5 digit ZIP code.'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_advanced|error',
        events: [41],
        eVars: {
          '47': `clinicaltrials_advanced`
        },
        props: {
          '74': `clinicaltrials_advanced|error`,
          '75': 'z|Please enter a valid 5 digit ZIP code.'
        }
      }
    }]
  ],
  [ "link_form_validation_error",
    "adv hospital",
    {
      formType: 'advanced',
      field: 'hospital',
      message: 'Please select a Hospital/Institution.'
    },
    [{
      type: "LINK",
      data: {
        linkname: 'formAnalysis|clinicaltrials_advanced|error',
        events: [41],
        eVars: {
          '47': `clinicaltrials_advanced`
        },
        props: {
          '74': `clinicaltrials_advanced|error`,
          '75': 'hos|Please select a Hospital/Institution.'
        }
      }
    }]
  ],
  // Completion event
  [ "link_form_submission_complete",
    "basic works",
    {
      formType: 'basic',
      wasScrolling: false
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_basic|complete',
          events: [39],
          eVars: { '47': `clinicaltrials_basic` },
          props: { '74': `clinicaltrials_basic|complete`}
        }
      }
    ]
  ],  
  [ "link_form_submission_complete",
    "adv works",
    {
      formType: 'advanced',
      wasScrolling: false
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_advanced|complete',
          events: [39],
          eVars: { '47': `clinicaltrials_advanced` },
          props: { '74': `clinicaltrials_advanced|complete`}
        }
      }
    ]
  ],  
  [ "link_form_submission_complete",
    "basic works when floating button",
    {
      formType: 'basic',
      wasScrolling: true
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_basic|complete',
          events: [39],
          eVars: { '47': `clinicaltrials_basic` },
          props: { '74': `clinicaltrials_basic|complete_scrolling`}
        }
      }
    ]
  ],  
  [ "link_form_submission_complete",
    "adv works",
    {
      formType: 'advanced',
      wasScrolling: true
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_advanced|complete',
          events: [39],
          eVars: { '47': `clinicaltrials_advanced` },
          props: { '74': `clinicaltrials_advanced|complete_scrolling`}
        }
      }
    ]
  ],
  // Submit with error
  [ "link_form_submission_error",
    "basic works",
    {
      formType: 'basic'
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_basic|error',
          events: [41],
          eVars: { '47': `clinicaltrials_basic` },
          props: { 
            '74': `clinicaltrials_basic|error`,
            '75': 'submit|attempted form submit with errors'
          }
        }
      }
    ]
  ],
  [ "link_form_submission_error",
    "adv works",
    {
      formType: 'advanced'
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_advanced|error',
          events: [41],
          eVars: { '47': `clinicaltrials_advanced` },
          props: { 
            '74': `clinicaltrials_advanced|error`,
            '75': 'submit|attempted form submit with errors'
          }
        }
      }
    ]
  ],
  // Abandoned
  [ "link_form_abandon",
    "basic works",
    {
      formType: 'basic',
      field: 'age',
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_basic|abandon',
          events: [40],
          eVars: { '47': `clinicaltrials_basic` },
          props: { '74': `clinicaltrials_basic|abandon|a`}
        }
      }
    ]
  ],  
  [ "link_form_abandon",
    "adv works",
    {
      formType: 'advanced',
      field: 'age',
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'formAnalysis|clinicaltrials_advanced|abandon',
          events: [40],
          eVars: { '47': `clinicaltrials_advanced` },
          props: { '74': `clinicaltrials_advanced|abandon|a`}
        }
      }
    ]
  ],  
  // Clear Form
  [ "link_clear_form_link",
    "adv works",
    {
      formType: 'advanced',      
    },
    [
      {
        type: "LINK",
        data: {
          linkname: 'clinicaltrials_advanced|clear',
          events: [68],
          eVars: { '47': `clinicaltrials_advanced` },
          props: { 
            '74': `clinicaltrials_advanced|clear`
          }
        }
      }
    ]
  ],  
]

describe("SearchAnalyticsActions", () => {
  test.each(TEST_CASES)(
    "%# - %s - %s",
    (actionName, scenario, eventdata, expected) => {
      const actual = SearchAnalyticsActions[actionName](eventdata);
      expect(actual).toEqual(expected);
    }
  );
})
