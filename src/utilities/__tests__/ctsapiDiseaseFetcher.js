import {ctsapiDiseaseFetcher} from '../ctsapiDiseaseFetcher';
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

describe('ctsapiDiseaseFetcher', () => {
  // Create a new client. The host does not matter as long
  // as it matches what is going to be called.
  const ctsapiClient = ClinicalTrialsServiceFactory.create('localhost');

  it('fetches the terms', () => {
    // Setup the nock scope so we can respond like we are the API.
    const scope = nock('https://localhost');

    const codes = ["C9133", "C153203"];
    const types = ['maintype', 'subtype', 'stage', 'finding'];    

    // Setup not only the JSON response, but this ensures that if the
    // parameters are not correct this test will fail.
    scope.get('/v1/diseases')
      .query(queryObject => {
        // We have to handle this ourselves because nock is dumb and does not 
        // let us control how arrays are parameterized.
        // This is a tiny bit inside baseball that we know what the request
        // will look like. On the other hand, we need to provide the params
        // to it, so is that really bad?

        const codesOk = queryObject['code[]'].length === codes.length &&
          queryObject['code[]'].every(code => codes.includes(code));
        const typesOk = queryObject['type[]'].length === types.length &&
          queryObject['type[]'].every(type => types.includes(type));
        const statusesOk = queryObject['current_trial_status[]'].length === ACTIVE_TRIAL_STATUSES.length &&
          queryObject['current_trial_status[]'].every(status => ACTIVE_TRIAL_STATUSES.includes(status));
        return codesOk && typesOk && statusesOk;
      })
      .reply(200, {            
        "terms": [
          {
            "name": "Adenosquamous Lung Cancer",
            "codes": [ "C9133" ],
            "ancestor_ids": ["C2926", "C4878"],
            "parent_ids": ["C2926"],
            "type": [ "subtype" ]
          },
          { 
            "name": "Advanced Lung Carcinoma",
            "codes": ["C153203"],
            "ancestor_ids": ["C4878"],
            "parent_ids": ["C4878"],
            "type": ["subtype"]
          }
        ]
      });

    return ctsapiDiseaseFetcher(ctsapiClient, ["C9133", "C153203"])
      .then(actual => {
        expect(actual).toEqual([
          {
            "name": "Adenosquamous Lung Cancer",
            "codes": [ "C9133" ],
            "parent_ids": ["C2926"],
            "type": [ "subtype" ]
          },
          { 
            "name": "Advanced Lung Carcinoma",
            "codes": ["C153203"],            
            "parent_ids": ["C4878"],
            "type": ["subtype"]
          }          
        ]);
        // Assert that nock got the expected request and finished.
        scope.done()
      })
    
  })
})