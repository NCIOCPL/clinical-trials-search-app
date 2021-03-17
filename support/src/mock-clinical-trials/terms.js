const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Async wrapper for access
 */
const accessAsync = util.promisify(fs.access);

/**
 * Mock handler for posting to /v1/terms endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const termsPost = async (req, res, next) => {
  res.status(501).end();
}

/**
 * Mock handler for posting to /v1/terms endpoint
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const termsGet = async (req, res, next) => {
  res.status(501).end();
}

/**
 * Entry point for /v1/terms requests.
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTerms = async (req, res, next) => {
  if (req.method === 'GET') {
    return termsGet(req, res, next);
  } else if (req.method === 'POST') {
    return termsPost(req, res, next);
  } else {
    // Method not allowed
    res.status(405).end();
  }
} 

module.exports = mockTerms;