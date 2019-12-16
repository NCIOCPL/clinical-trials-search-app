import { get62Contents, EVENT_TYPES, FIELD_TO_KEY_MAP } from './cts-analytics-common';

/**********************
 * DO NOT COPY ABOVE THIS LINE
 **********************/

export const SearchAnalyticsActions = {};

//--------------------
// Search Forms
//--------------------
SearchAnalyticsActions.load_basic_search = (data) => {

  return [
    {
      type: EVENT_TYPES.Load,
      data: {
        eVars: { '62': get62Contents('basic') },
        // Prop44 comes from elsewhere, so not including.
        props: { '62': get62Contents('basic') }
      }
    },
    // Because of legacy reasons, there is a link
    // track on page load as well.
    {
      type: EVENT_TYPES.Link,
      data: {
        events: [37],
        eVars: { '47': 'clinicaltrials_basic' },
        // Prop67 seems to come for free, so not including
        props: { '74': 'clinicaltrials_basic|display'}
      }
    }
  ]
};

SearchAnalyticsActions.load_advanced_search = (data) => {
  return [
    {
      type: EVENT_TYPES.Load,
      data: {
        eVars: { '62': get62Contents('advanced') },
        // Prop44 comes from elsewhere, so not including.
        props: { '62': get62Contents('advanced')}
      }
    },
    // Because of legacy reasons, there is a link
    // track on page load as well.
    {
      type: EVENT_TYPES.Link,
      data: {
        events: [37],
        eVars: { '47': 'clinicaltrials_advanced' },
        // Prop67 seems to come for free, so not including
        props: { '74': 'clinicaltrials_advanced|display'}
      }
    }
  ];
};

SearchAnalyticsActions.link_form_start = (data) => {

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `formAnalysis|clinicaltrials_${data.formType}|start`,
      events: [38],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `clinicaltrials_${data.formType}|start`,
      }
    }
  }];

};

SearchAnalyticsActions.link_clear_form_link = (data) => {

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `clinicaltrials_advanced|clear`,
      events: [68],
      eVars: { '47': `clinicaltrials_${data.formType}` },
      props: { '74': `clinicaltrials_${data.formType}|clear`}
    }
  }];
};

SearchAnalyticsActions.link_form_submission_complete = (data) => {

  // TODO: logic for event46 did we do the Levenshtein distance thing for
  // a basic form's keyword

  const completion = data['wasScrolling'] ? 'complete_scrolling' : 'complete';

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `formAnalysis|clinicaltrials_${data.formType}|complete`,
      events: [39],
      eVars: { '47': `clinicaltrials_${data.formType}` },
      props: { '74': `clinicaltrials_${data.formType}|${completion}`}
    }
  }];
};

SearchAnalyticsActions.link_form_submission_error = (data) => {

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `formAnalysis|clinicaltrials_${data.formType}|error`,
      events: [41],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `clinicaltrials_${data.formType}|error`,
        '75': 'submit|attempted form submit with errors'
      }
    }
  }];

};


SearchAnalyticsActions.link_form_validation_error = (data) => {

  const fieldName = FIELD_TO_KEY_MAP[data.field] ?
    FIELD_TO_KEY_MAP[data.field] :
    data.field;

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `formAnalysis|clinicaltrials_${data.formType}|error`,
      events: [41],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `clinicaltrials_${data.formType}|error`,
        '75': `${fieldName}|${data.message}`
      }
    }
  }];

};

SearchAnalyticsActions.link_form_abandon = (data) => {

  const fieldName = FIELD_TO_KEY_MAP[data.field] ?
    FIELD_TO_KEY_MAP[data.field] :
    data.field;

  return [{
    type: EVENT_TYPES.Link,
    data: {
      linkname: `formAnalysis|clinicaltrials_${data.formType}|abandon`,
      events: [40],
      eVars: {
        '47': `clinicaltrials_${data.formType}`
      },
      props: {
        '74': `clinicaltrials_${data.formType}|abandon|${fieldName}`
      }
    }
  }];

};

