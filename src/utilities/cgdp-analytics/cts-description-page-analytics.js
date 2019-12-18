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

DescriptionAnalyticsActions.link_print_share_button = (data) => {
  return [{
    type: 'LINK',
    data: {
      events: [17],
      props: {
        '5': `print|${window.location.host}${window.location.pathname}`,
        '43': "print",
        '66': "print"
      }
    }
  }];
}

DescriptionAnalyticsActions.link_email_share_button = (data) => {
  return [{
    type: 'LINK',
    data: {
      events: [17],
      props: {
        '5': `email|${window.location.host}${window.location.pathname}`,
        '43': "email",
        '66': "email"
      }
    }
  }];
}
