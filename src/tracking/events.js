/**
 * @typedef BaseEvent
 * @type {object}
 * @property {string} action - Event action type
 * @property {object} data -  Additional event data passed into analytics
 * @property {string} source - Event source name
 */

/**
 * Returns a base event object
 * @returns {BaseEvent}
 */
function getBaseEventObj() {
  const retObj = {
    action: '',
    data: {},
    source: '',
  };
  return retObj;
}

/**
 * ClearFormLinkClick - Default analytics data dispatched on clicking the clear form link on the search page
 */
export const ClearFormLinkClick = {
    ...getBaseEventObj(),
    action: 'click',
    source: 'clear_form_link',
};

/**
 * FormAbandonment - Default analytics data dispatched when form is exited after user starts interacting with form
 * (data updated before trackEvent is triggered)
 */
export const FormAbandonment = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    status: 'abandon'
  },
  source: 'form_abandon'
};

/**
 * FindTrialsButtonClickComplete - Default analytics data dispatched for basic and advanced trial search click
 */
export const FindTrialsButtonClickComplete = {
  ...getBaseEventObj(),
  action: 'click',
  source: 'form_submission_complete',
};

/**
 * FindTrialsButtonClickError - Default analytics data dispatched for basic and advanced trial search click
 */
export const FindTrialsButtonClickError = {
  ...getBaseEventObj(),
  action: 'click',
  source: 'form_submission_error',
};

/**
 * FormInteractionStart - Default analytics data dispatched  when "Modify Search Criteria" link is clicked on results page
 * (data updated before trackEvent is triggered)
 */
export const FormInteractionStart = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    status: 'start'
  },
  source: 'form_start'
};

/**
 * InputValidation - Default analytics data dispatched for basic and advanced trial search click
 */
export const InputValidation = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    status: 'input_error'
  },
  source: 'form_validation_error',
};

/**
 * PrintSelectedButtonClick - Default analytics data dispatched for when user clicks 'Print Selected' button with selected results
 */
export const PrintSelectedButtonClick = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    formType: 'basic',
  },
  source: 'print_selected_button',
};

/**
 * PrintNoneSelectedClick - Default analytics data dispatched for when user has not selected any result items for print
 */
export const PrintNoneSelectedClick = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    formType: 'basic',
  },
  source: 'print_selected_none_selected_button',
};

/**
 * PrintMaxExceededClick - Default analytics data dispatched when user selects more than max(100) results to print
 */
export const PrintMaxExceededClick = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    formType: 'basic',
  },
  source: 'print_selected_max_reached_button',
};

/**
 * ModifySearchCriteriaLinkClick - Default analytics data dispatched  when "Modify Search Criteria" link is clicked on results page
 * (data updated before trackEvent is triggered)
 */
export const ModifySearchCriteriaLinkClick = {
  ...getBaseEventObj(),
  action: 'click',
  source: 'modify_search_criteria_link',
};

/**
 * NewSearchLinkClick - Analytics data dispatched on clicking "Start Over" or "Try a new search" link on results page 
 * (data and source updated before trackEvent is triggered)
 */
export const NewSearchLinkClick = {
    ...getBaseEventObj(),
    action: 'click',
};