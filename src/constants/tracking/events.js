
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
        source: ''
    }
    return retObj;
};

/**
 * FindTrialsButtonClick - Default analytics data dispatched for basic and advanced trial search click (defaults to basic)
 * @returns {BaseEvent} 
 */
export const FindTrialsButtonClick = {
    ...getBaseEventObj(),
    action: 'click',
    data: {
        formType: 'basic'
    },
    source: 'find_trials_button'
};
