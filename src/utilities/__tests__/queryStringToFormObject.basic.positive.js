import { queryStringToFormObject } from '../queryStringToFormObject';
import { getDiseaseFetcher, TYPE_EXPECTATION} from './queryStringToFormObject.common';
import {defaultState} from '../../store/reducers/form';



describe('Basic - queryStringToFormObject maps query to form', () => {

  const goodMappingTestCases = [
    [ "no query params",
      '',
      async () => [],
      async () => [],
      async () => null,
      {}
    ],
    [ "basic - no params",
      'rl=1',
      async () => [],
      async () => [],
      async () => null,
      {}
    ],
    [ "basic - single id cancer type",
      "?t=C1111",
      getDiseaseFetcher(["C1111"], ["Main Type A"]),
      async () => [],
      async () => null,
      {
        cancerType: TYPE_EXPECTATION["Main Type A"]
      }
    ],
    [ "basic - multi id cancer type",
      "?t=C1112|C1113",
      getDiseaseFetcher(["C1112", "C1113"], ["Main Type B"]),
      async () => [],
      async () => null,
      {
        cancerType: TYPE_EXPECTATION["Main Type B"]
      }
    ],
    [ "basic - cancer type - subtype",
      "?t=C2222",
      getDiseaseFetcher(["C2222"], ["Subtype A"]),
      async () => [],
      async () => null,
      {
        cancerType: TYPE_EXPECTATION["Subtype A"]
      }
    ],
    [ "basic - cancer type - stage",
      "?t=C3333",
      getDiseaseFetcher(["C3333"], ["Stage A"]),
      async () => [],
      async () => null,
      {
        cancerType: TYPE_EXPECTATION["Stage A"]
      }
    ],    
    [ "basic - age",
      'a=35',
      async () => [],
      async () => [],
      async () => null,
      {
        age: 35
      }
    ],
    [ "basic - phrase",
      'q=chicken',
      async () => [],
      async () => [],
      async () => null,
      {
        keywordPhrases: "chicken"
      }
    ],
    [ "basic - phrase with commas",
      'q=chicken, fish, and beans',
      async () => [],
      async () => [],
      async () => null,
      {
        keywordPhrases: "chicken, fish, and beans"
      }
    ],
    [ "basic - zip code",
      "?loc=1&z=20850",
      async () => [],
      async () => [],
      async (zip) => ({lat: 39.0897, long: -77.1798}),
      {
        location: 'search-location-zip',
        zip: "20850",
        zipCoords: {lat: 39.0897, long: -77.1798}
      }
    ],
  ];

  // Test iterates over multiple cases defined by mappingTestCases
  test.each(goodMappingTestCases)(
    "%# - correctly maps %s",
    ( testName,
      urlQuery,
      diseaseFetcher,
      interventionsFetcher,
      zipcodeFetcher,
      additionalExpectedQuery
    ) => {

      const expected = {
        formState: {
          ...defaultState,
          ...additionalExpectedQuery
        },
        errors: []
      }

      return queryStringToFormObject(
        urlQuery,
        diseaseFetcher,
        interventionsFetcher,
        zipcodeFetcher,
      ).then(actual => {
        expect(actual).toEqual(expected);
      });
    }
  );

});