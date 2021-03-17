/// <reference path="../../node_modules/@types/express/index.d.ts"/>
const proxy = require('http-proxy-middleware');
const express = require('express');

const mockZipCodeLookup = require('./mock-zipcode-lookup');


const mockClinicalTrial = require('./mock-clinical-trials/clinical-trial');
const mockClinicalTrials = require('./mock-clinical-trials/clinical-trials');
const mockInterventions = require('./mock-clinical-trials/interventions');
const mockTerm = require('./mock-clinical-trials/term');
const mockTerms = require('./mock-clinical-trials/terms');
const mockDiseases = require('./mock-clinical-trials/diseases');



module.exports = function(app) {

  // Any posts done with application/json will have thier body convered as an object.
  app.use(express.json());

  // CTS API Mocks
  // NOTE: The client does not allow us to change the base path.
  // So 
  app.use('/v1/clinical-trial/:id', mockClinicalTrial);
  app.use('/v1/clinical-trials', mockClinicalTrials);
  app.use('/v1/interventions', mockInterventions);
  app.use('/v1/term/:term_key', mockTerm);
  app.use('/v1/terms', mockTerms);
  app.use('/v1/diseases', mockDiseases);

  // Handle mock requests for the zip code lookup API
  app.use('/mock-api/zip_code_lookup/:zip', mockZipCodeLookup);

  // The Zip Code API does not allow CORS headers, so we must proxy it for
  // local development.
  app.use(
    '/cts_api/**',
    proxy({
      target : 'https://www.cancer.gov/',
      changeOrigin: true,
    })
  );
}
