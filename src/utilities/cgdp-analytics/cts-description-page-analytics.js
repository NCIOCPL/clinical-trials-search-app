import { get62Contents, EVENT_TYPES } from './cts-analytics-common';

/**********************
 * DO NOT COPY ABOVE THIS LINE
 **********************/


export const DescriptionAnalyticsActions = {};

//-------------------------
// Description page events
//-------------------------

DescriptionAnalyticsActions.load_trial_description = (data) => {
  return [{
    type: EVENT_TYPES.Load,
    data: {
      eVars: { '62': get62Contents(data.formType) },
      // Prop44 comes from elsewhere, so not including.
      props: {
        '16': data.nctId,
        '62': get62Contents(data.formType)
      }
    }
  }];
};
