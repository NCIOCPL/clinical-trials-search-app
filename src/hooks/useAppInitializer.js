import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {updateGlobal, updateForm} from '../store/actions';

import {
  ctsapiDiseaseFetcher,
  ctsapiInterventionFetcher,
  zipcodeFetcher,
  queryStringToFormObject
} from '../utilities';

let internalAppHasBeenInitialized = false;

export const useAppInitializer = (ctsapiclient, zipcodeEndpoint) => {
  // This must be called before any conditionals
  const dispatch = useDispatch();

  // Prevent this hook from ever being called more than
  // once. Kind of dirty I know...
  if (internalAppHasBeenInitialized) {
    return;
  } else {
    internalAppHasBeenInitialized = true;
  }

  const runQueryStuff = async () => {
    const diseaseFetcher = async (ids) => await ctsapiDiseaseFetcher(ctsapiclient, ids);
    const interventionFetcher = async (ids) => await ctsapiInterventionFetcher(ctsapiclient, ids);
    const zipFetcher = async (zipcode) => await zipcodeFetcher(zipcodeEndpoint, zipcode);
  
    // TODO: FIX THIS! BAD BAD BAD!
    const querystring = window.location.search;
  
    // Only try and rehydrate the store if there are actual query params OR,
    // this is a results page. (A results page REQUIRES query params)
    if (window.location.pathname.endsWith('/r') || querystring.length > 0) {
      const initResults = await queryStringToFormObject(querystring, diseaseFetcher, interventionFetcher, zipFetcher);
  
      if (initResults.errors.length === 0) {
        dispatch(updateForm(initResults.formState));        
      } else {
        // Show Error message
        dispatch(updateGlobal({
          field: 'initErrorsList',
          value: initResults.errors
        }));
      }
    }  
    
    dispatch(updateGlobal({
      field: 'appHasBeenInitialized',
      value: true
    }));    
  }
  
  // Fire off the async function but do not wait for it to
  // return. (Don't worry, react will stay running and at
  // some point the appHasBeenInitialized will get updated)
  runQueryStuff();
};
