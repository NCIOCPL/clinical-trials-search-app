import { queryStringToFormObject } from '../queryStringToFormObject';
import {defaultState} from '../../store/reducers/form';
import { getDiseaseFetcher} from './queryStringToFormObject.common';

describe('Basic - Negative - queryStringToFormObject maps query to form', () => {

  const errorMappingTestCases = [
    [ "bad rl parameter",
      'rl=22',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "formType",
          message: "Results Link Flag can only equal 1 or 2."
        }
      ]
    ],
    ["basic - bad main type",
      't=chicken',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "cancerType",
          message: "Please enter a valid parameter"
        }
      ]
    ],
    [ "basic - bad multiple main types",
      't=C1111,C1112',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "cancerType",
          message: "Please include only one main cancer type in your search."
        }
      ]
    ],
    [ "basic - unknown type",
      't=C9999',
      getDiseaseFetcher(["C9999"], []),
      async () => [],
      async () => null,
      [
        { 
          fieldName: "cancerType",
          message: "Unknown disease ID"
        }
      ]
    ],
    [ "basic - disallowed disease type",
      't=C4444',
      getDiseaseFetcher(["C4444"], ["Finding A"]),
      async () => [],
      async () => null,
      [
        { 
          fieldName: "cancerType",
          message: "Incorrect disease type"
        }
      ]
    ],
    [ "basic - bad age nan",
      'a=chicken',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "age",
          message: "Please enter a valid age parameter."
        }
      ]    
    ],
    [ "basic - bad age <0",
      'a=-1',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "age",
          message: "Please enter a valid age parameter."
        }
      ]    
    ],
    [ "basic - bad age >120",
      'a=122',
      async () => [],
      async () => [],
      async () => null,
      [
        { 
          fieldName: "age",
          message: "Please enter a valid age parameter."
        }
      ]    
    ],
    // TODO: negative location tests
  ];

  // Test iterates over multiple cases defined by mappingTestCases
  test.each(errorMappingTestCases)(
    "%# - errors mapping %s",
    ( testName,
      urlQuery,
      diseaseFetcher,
      interventionsFetcher,
      zipcodeFetcher,
      expectedErrors
    ) => {

      const expected = {
        formState: null,
        errors: expectedErrors
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
