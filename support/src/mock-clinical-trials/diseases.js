const fs = require('fs');
const { emptyDir } = require('fs-extra');
const path = require('path');
const util = require('util');

const isValidTrialStatusList = require('./is-valid-trial-status-list');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/diseases endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const diseasesPost = async (req, res, next) => {
  // I don't think we use this, so not implementing
  res.status(501).end();
}

/**
 * Mock handler for posting to /v1/diseases endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const diseasesGet = async (req, res, next) => {
  const { code, current_trial_status, name, size, sort, type } = req.query;

  // First strip off current_trial_status and ensure it matches our required types.
  // This way we don't have to make it part of the file name.
  if (!isValidTrialStatusList(current_trial_status)) {
    // Let's do a 400 here instead of 404 given it is less a mock is not found
    // but your request is broken.
    res.status(400).end();
  }

  // File naming is
  // <codes>_<types>_<size>_<sort>
  // codes can be 
  // C1-C2-C3 to separate the disease concepts
  // each disease concept can have multiple IDs comma separated
  // so we could have C1,C2-C3-C4,C5 if we have 3 concepts, C1,C2 and C3 and C4,C5

  // TODO: This needs to be sanitized.
  const name_fragment = name ? name : "empty";

  const code_fragment = code && Array.isArray(code) && code.length > 0 ? code.join('-') : "empty";
  const type_fragment = type && Array.isArray(type) && type.length > 0 ? type.join('-') : "empty";
  const size_fragment = size ? size : "empty";
  const sort_fragment = sort ? sort : "empty";

  const fileName = `${code_fragment}_${type_fragment}_${size_fragment}_${sort_fragment}.json`;

  const mockFile = path.join(
    __dirname,
    '..',
    '..',
    'mock-data',
    'diseases',
    fileName
  )

  try {
    await accessAsync(mockFile);
    res.sendFile(mockFile);
  } catch (err) {
      // Access denied to open file, or not found.
      // treat at 404, or your choice.
      console.error(err);
      res.status(404).end();
  }
}

/**
 * Entry point for /v1/diseases requests.
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockDiseases = async (req, res, next) => {
  if (req.method === 'GET') {
    return diseasesGet(req, res, next);
  } else if (req.method === 'POST') {
    return diseasesPost(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
} 

module.exports = mockDiseases;