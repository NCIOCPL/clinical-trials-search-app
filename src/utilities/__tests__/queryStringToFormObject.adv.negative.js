import { queryStringToFormObject } from '../queryStringToFormObject';
import {defaultState} from '../../store/reducers/form';
import { getDiseaseFetcher} from './queryStringToFormObject.common';

describe('Adv - Negative - queryStringToFormObject maps query to form', () => {

  const errorMappingTestCases = [
    // Other fields
    [ "adv - bad age nan",
      'a=chicken&rl=2',
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
    [ "adv - bad age <0",
      'a=-1&rl=2',
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
    [ "adv - bad age >120",
      'a=122&rl=2',
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
    [ "Healthy Volunteers - bad number",
      "rl=2&hv=2",
      async () => [],
      async () => [],
      async () => null,
      [
        {
          fieldName: 'healthyVolunteers',
          message: "Please enter a valid healthy volunteer indicator."
        }
      ]
    ],
    [ "Healthy Volunteers - not a number",
      "rl=2&hv=chicken",
      async () => [],
      async () => [],
      async () => null,
      [
        {
          fieldName: 'healthyVolunteers',
          message: "Please enter a valid healthy volunteer indicator."
        }
      ]
    ],
    [
      "Trial Type - unknown id",
      "rl=2&tt=chicken",
      async () => [],
      async () => [],
      async () => null,
      [{
        fieldName: 'trialTypes',
        message: 'Invalid selection'
      }]
    ],
    [
      "Phase - unknown id",
      "rl=2&tp=chicken",
      async () => [],
      async () => [],
      async () => null,
      [{
        fieldName: 'trialPhases',
        message: 'Invalid selection'
      }]
    ],    
    [
      "Pager test - bad",
      "rl=2&pn=chicken",
      async () => [],
      async () => [],
      async () => null,
      [{
        fieldName: 'resultsPage',
        message: 'Invalid parameter'
      }]
    ],
    [
      "Pager test - bad",
      "rl=2&pn=-1",
      async () => [],
      async () => [],
      async () => null,
      [{
        fieldName: 'resultsPage',
        message: 'Invalid parameter'
      }]
    ]    
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
