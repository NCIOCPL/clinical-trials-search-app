/// <reference path="../node_modules/@types/express/index.d.ts"/>
const proxy = require('http-proxy-middleware');

const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * getZipCodeLookup - Middleware for getting mock zip code lookup response
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const getZipCodeLookup = async (req, res, next) => {
  // cts_api/zip_code_lookup/:zip yields zip param
  const zip = req.params.zip;

  // IMPLEMENTOR NOTE: You are mocking the API, so if the API returns an object
  // when something is not found like search results, you need to handle that.
  // This is custom code and is not something easily mocked up.

  // IMPLEMENTOR NOTE: Always good to integration test 500 errors with your app
  if (zip === 'server-error') {
    res.status(500).end();
  }

  // IMPLEMENTOR NOTE: Always good to integration test 404 errors with your app
  if (zip === 'not-found') {
    res.status(404).end();
  }

  // IMPLEMENTOR NOTE: Always good to integration test 400 errors with your app
  if (zip === 'bad-request' || zip === '999g9') {
    res.status(400).end();
  }

  // IMPLEMENTOR NOTE: The mock data should match the API's folder structure.
  const mockDir = path.join(__dirname, 'mocks', 'zip');

  try {
    // IMPLEMENTOR NOTE: The mock data file name should be the end part of the path
    // if it is dynamic and any other query params to make it distinct.
    // This example is basic...
    const mockFile = path.join(mockDir, `${zip}.json`);

    try {
      // Test if it exists.
      await accessAsync(mockFile);
      res.sendFile(mockFile);
    } catch (err) {
      // Access denied to open file, or not found.
      // treat at 404, or your choice.
      console.error(err);
      res.status(404).end();
    }
  } catch (err) {
    // This must be an error from sending the file, or joining
    // the path.
    console.error(err);
    res.status(500).end();
  }
};

module.exports = function(app) {
  app.use('/cts_api/zip_code_lookup/:zip', getZipCodeLookup);
  app.use(
    '/cts_api/**',
    proxy({ 
      target : 'https://ncigovcdode399.prod.acquia-sites.com',
      changeOrigin: true,
    })
  );
}
