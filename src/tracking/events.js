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
 * @returns {BaseEvent}
 */
export const ClearFormLinkClick = {
    ...getBaseEventObj(),
    action: 'click',
    data: {
      formType: 'advanced',
    },
    source: 'clear_form_link',
};

/**
 * FindTrialsButtonClick - Default analytics data dispatched for basic and advanced trial search click (defaults to basic)
 * @returns {BaseEvent}
 */
export const FindTrialsButtonClick = {
  ...getBaseEventObj(),
  action: 'click',
  data: {
    formType: 'basic',
  },
  source: 'find_trials_button',
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
 * @returns {BaseEvent}
 */
export const ModifySearchCriteriaLinkClick = {
  ...getBaseEventObj(),
  action: 'click',
  source: 'modify_search_criteria_link',
};

/**
 * NewSearchLinkClick - Analytics data dispatched on clicking "Start Over" or "Try a new search" link on results page 
 * (data and source updated before trackEvent is triggered)
 * @returns {BaseEvent}
 */
export const NewSearchLinkClick = {
    ...getBaseEventObj(),
    action: 'click',
};