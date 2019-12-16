import { ResultsAnalyticsActions} from '../cts-results-page-analytics';

const TEST_CASES = [
  [ "link_results_page_link",
    "basic - page 1 result 5",
    {
      formType: 'basic',
      resultsPosition: 5,
      pageNum: 1
    },
    [{
      type: "LINK",
      data: {
        events: [42],
        props: {
          '12': 'clinicaltrials_basic',
          '13': '5|page 1'
        },
        eVars: {
          '12': 'clinicaltrials_basic'
        }
      }
    }]
  ]
]

describe("ResultsAnalyticsActions - Link Tests", () => {
  test.each(TEST_CASES)(
    "%# - %s - %s",
    (actionName, scenario, eventdata, expected) => {
      const actual = ResultsAnalyticsActions[actionName](eventdata);
      expect(actual).toEqual(expected);
    }
  );
})
