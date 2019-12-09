import { queryStringToFormObject } from '../queryStringToFormObject';
import {defaultState} from '../../store/reducers/form';
import { getInterventionFetcher, INTERVENTION_EXPECTATION} from './queryStringToFormObject.common';

describe('Adv - Interventions - queryStringToFormObject maps query to form', () => {

  const goodMappingTestCases = [
    // Drugs
    [ "single id drug",
      "?d=C5555&rl=2",
      async () => [],
      getInterventionFetcher(["C5555"], ["Drug A"]),
      async () => null,
      {
        drugs: [INTERVENTION_EXPECTATION["Drug A"]],
        formType: "advanced"
      }
    ],
    [ "drug - extra id",
      "?d=C5555|C9999&rl=2",
      async () => [],
      getInterventionFetcher(["C5555","C9999"], ["Drug A"]),
      async () => null,
      {
        drugs: [INTERVENTION_EXPECTATION["Drug A"]],
        formType: "advanced"
      }
    ],
    [ "drug - api extra ID",
      "?d=C5557&rl=2",
      async () => [],
      getInterventionFetcher(["C5557"], ["Drug B"]),
      async () => null,
      {
        drugs: [INTERVENTION_EXPECTATION["Drug B"]],
        formType: "advanced"
      }
    ],
    [ "multi id drug",
      "?d=C5556|C5557&rl=2",
      async () => [],
      getInterventionFetcher(["C5556","C5557"], ["Drug B"]),
      async () => null,
      {
        drugs: [INTERVENTION_EXPECTATION["Drug B"]],
        formType: "advanced"
      }
    ],
    [ "drug - agent category",
      "?d=C5558&rl=2",
      async () => [],
      getInterventionFetcher(["C5558"], ["Drug Category A"]),
      async () => null,
      {
        drugs: [INTERVENTION_EXPECTATION["Drug Category A"]],
        formType: "advanced"
      }
    ],
    [ "multiple drugs",
      "?d=C5555,C5556|C5557&rl=2",
      async () => [],
      getInterventionFetcher(["C5555","C5556","C5557"], ["Drug A", "Drug B"]),
      async () => null,
      {
        drugs: [
          INTERVENTION_EXPECTATION["Drug A"],
          INTERVENTION_EXPECTATION["Drug B"]
        ],
        formType: "advanced"
      }
    ],
    // Other Treatments
    [ "single id other treatment",
      "?i=C6666&rl=2",
      async () => [],
      getInterventionFetcher(["C6666"], ["Treatment A"]),
      async () => null,
      {
        treatments: [INTERVENTION_EXPECTATION["Treatment A"]],
        formType: "advanced"
      }
    ],
    [ "treatment - extra id",
      "?i=C6666|C9999&rl=2",
      async () => [],
      getInterventionFetcher(["C6666","C9999"], ["Treatment A"]),
      async () => null,
      {
        treatments: [INTERVENTION_EXPECTATION["Treatment A"]],
        formType: "advanced"
      }
    ],
    [ "treatment - api extra ID",
      "?i=C6667&rl=2",
      async () => [],
      getInterventionFetcher(["C6667"], ["Treatment B"]),
      async () => null,
      {
        treatments: [INTERVENTION_EXPECTATION["Treatment B"]],
        formType: "advanced"
      }
    ],
    [ "multi id treatments",
      "?i=C6667|C6668&rl=2",
      async () => [],
      getInterventionFetcher(["C6667","C6668"], ["Treatment B"]),
      async () => null,
      {
        treatments: [INTERVENTION_EXPECTATION["Treatment B"]],
        formType: "advanced"
      }
    ],
    [ "multiple drugs",
      "?i=C6666,C6667|C6668&rl=2",
      async () => [],
      getInterventionFetcher(["C6666","C6667","C6668"], ["Treatment A", "Treatment B"]),
      async () => null,
      {
        treatments: [
          INTERVENTION_EXPECTATION["Treatment A"],
          INTERVENTION_EXPECTATION["Treatment B"]
        ],
        formType: "advanced"
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