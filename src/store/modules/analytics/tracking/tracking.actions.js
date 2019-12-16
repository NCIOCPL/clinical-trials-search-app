// Action type declarations
export const ADD_FORM_TO_TRACKING = 'ADD_FORM_TO_TRACKING';
export const DISPATCHED_FORM_INTERACTION_EVENT = 'DISPATCHED_FORM_INTERACTION_EVENT';
export const TRACK_FORM_INPUT_CHANGE = 'TRACK_FORM_INPUT_CHANGE';

// Actions
export const addFormToTracking = (payload) => {
    console.log(`${ADD_FORM_TO_TRACKING}:`, payload);
  return {
      type: ADD_FORM_TO_TRACKING,
      payload
  }
};

export const dispatchedFormInteractionEvent = (payload) => {
    return {
        type: DISPATCHED_FORM_INTERACTION_EVENT,
        payload
    }
};

export const trackFormInputChange = ( payload ) => {
  return {
      type: TRACK_FORM_INPUT_CHANGE,
      payload
  };
};