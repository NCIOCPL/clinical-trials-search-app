import {ctsapiInterventionFetcher} from '../ctsapiInterventionFetcher';
import nock from 'nock';
import {ClinicalTrialsServiceFactory} from '@nciocpl/clinical-trials-search-client.js';
import {ACTIVE_TRIAL_STATUSES} from '../../constants'

// Turn off networking before running any tests.
beforeAll(() => {
  nock.disableNetConnect();
});

// Clean up the state of nock after each test.
afterEach(() => {
  nock.cleanAll();
});

describe('ctsapiInterventionsFetcher', () => {
  // Create a new client. The host does not matter as long
  // as it matches what is going to be called.
  const ctsapiClient = ClinicalTrialsServiceFactory.create('localhost');

  it('fetches the terms', () => {
    // Setup the nock scope so we can respond like we are the API.
    const scope = nock('https://localhost');

    const codes = ["C15974", "C308"];

    // Setup not only the JSON response, but this ensures that if the
    // parameters are not correct this test will fail.
    scope.get('/v1/interventions')
      .query(queryObject => {
        // We have to handle this ourselves because nock is dumb and does not 
        // let us control how arrays are parameterized.
        // This is a tiny bit inside baseball that we know what the request
        // will look like. On the other hand, we need to provide the params
        // to it, so is that really bad?

        const codesOk = queryObject['code[]'].length === codes.length &&
          queryObject['code[]'].every(code => codes.includes(code));
        const statusesOk = queryObject['current_trial_status[]'].length === ACTIVE_TRIAL_STATUSES.length &&
          queryObject['current_trial_status[]'].every(status => ACTIVE_TRIAL_STATUSES.includes(status));
        return codesOk && statusesOk;
      })
      .reply(200, {            
        "terms": [
          {
            "name": "Biological Cancer Immunotherapy",
            "codes": [
              "C15974"
            ],
            "synonyms": [
              "Biological Immunotherapy for Cancer",
              "Immunotherapy, Cancer, Biological"
            ],
            "category": "agent category",
            "count": 6
          },
          {
            "name": "Immunotherapy",
            "codes": [
              "C308",
              "C15262"
            ],
            "synonyms": [
              "Immunotherapeutic Agent",
              "BRM",
              "Biological Response Modifier",
              "Biomodulators",
              "Immune Mediators",
              "Immune Modulators",
              "Immune Regulators",
              "Immunomodulating Agent",
              "Immunomodulators",
              "Immunomodulatory Agent",
              "Immunopotentiators",
              "Immunotherapy Agent",
              "Immunologically Directed Therapy",
              "Immunotherapy"
            ],
            "category": "agent category",
            "count": 5408
          },          
        ]
      });

    return ctsapiInterventionFetcher(ctsapiClient, ["C15974", "C308"])
      .then(actual => {
        expect(actual).toEqual([
          {
            "name": "Biological Cancer Immunotherapy",
            "codes": [
              "C15974"
            ],
            "synonyms": [
              "Biological Immunotherapy for Cancer",
              "Immunotherapy, Cancer, Biological"
            ],
            "category": "agent category",
          },
          {
            "name": "Immunotherapy",
            "codes": [
              "C308",
              "C15262"
            ],
            "synonyms": [
              "Immunotherapeutic Agent",
              "BRM",
              "Biological Response Modifier",
              "Biomodulators",
              "Immune Mediators",
              "Immune Modulators",
              "Immune Regulators",
              "Immunomodulating Agent",
              "Immunomodulators",
              "Immunomodulatory Agent",
              "Immunopotentiators",
              "Immunotherapy Agent",
              "Immunologically Directed Therapy",
              "Immunotherapy"
            ],
            "category": "agent category",
          },          
      ]);
        // Assert that nock got the expected request and finished.
        scope.done()
      })
    
  })
})