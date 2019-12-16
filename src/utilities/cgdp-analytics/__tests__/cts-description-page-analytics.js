import {DescriptionAnalyticsActions} from '../cts-description-page-analytics';

const TEST_CASES = [
  // PAGE LOAD
  [ "load_trial_description",
    "basic works",
    {
      formType: 'basic',
      nctId: 'NCT123456789'
    },
    [{
      type: 'LOAD',
      data: {
        eVars: { '62': "Clinical Trials: Basic" },
        props: {
          '16': 'NCT123456789',
          '62': "Clinical Trials: Basic"
        }
      }
    }]
  ],
  [ "load_trial_description",
    "advanced works",
    {
      formType: 'advanced',
      nctId: 'NCT123456789'
    },
    [{
      type: 'LOAD',
      data: {
        eVars: { '62': "Clinical Trials: Advanced" },
        props: {
          '16': 'NCT123456789',
          '62': "Clinical Trials: Advanced"
        }
      }
    }]
  ],
  // This is from a dynamic listing page.
  [ "load_trial_description",
    "custom works",
    {
      formType: 'custom',
      nctId: 'NCT123456789'
    },
    [{
      type: 'LOAD',
      data: {
        eVars: { '62': "Clinical Trials: Custom" },
        props: {
          '16': 'NCT123456789',
          '62': "Clinical Trials: Custom"
        }
      }
    }]
  ],
  // This is for something like google
  [ "load_trial_description",
    "direct works",
    {
      formType: '',
      nctId: 'NCT123456789'
    },
    [{
      type: 'LOAD',
      data: {
        eVars: { '62': "Clinical Trials: Direct" },
        props: {
          '16': 'NCT123456789',
          '62': "Clinical Trials: Direct"
        }
      }
    }]
  ],
];

describe("DescriptionAnalyticsActions", () => {
  test.each(TEST_CASES)(
    "%# - %s - %s",
    (actionName, scenario, eventdata, expected) => {
      const actual = DescriptionAnalyticsActions[actionName](eventdata);
      expect(actual).toEqual(expected);
    }
  );

})

describe("", () => {

  jsdom.reconfigure({
    url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=nci-2019-1234',
  });

  test("click_print_share_button", () => {
    const expected = [{
      type: 'LINK',
      data: {
        events: [17],
        props: {
          '5': 'print|www.cancer.gov/about-cancer/treatment/clinical-trials/search/v',
          '43': "print",
          '66': "print"
        }
      }
    }];

    const eventdata = {
      formType: 'basic'
    };
 
    const actual = DescriptionAnalyticsActions['click_print_share_button'](eventdata);
    expect(actual).toEqual(expected);
  });

  test("click_email_share_button", () => {
    const expected = [{
      type: 'LINK',
      data: {
        events: [17],
        props: {
          '5': 'email|www.cancer.gov/about-cancer/treatment/clinical-trials/search/v',
          '43': "email",
          '66': "email"
        }
      }
    }];

    const eventdata = {
      formType: 'basic'
    };
 
    const actual = DescriptionAnalyticsActions['click_email_share_button'](eventdata);
    expect(actual).toEqual(expected);
  });

});