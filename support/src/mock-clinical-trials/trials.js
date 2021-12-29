const fs = require('fs');
const path = require('path');
const util = require('util');

const isValidTrialStatusList = require('./is-valid-trial-status-list');
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
const trialsPost = async (req, res, next) => {
	res.status(501).end();
};

/**
 * Mock handler for posting to /trials endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const trialsGet = async (req, res, next) => {
	const { agg_field, current_trial_status, agg_name, size } = req.query;

	// First strip off current_trial_status and ensure it matches our required types.
	// This way we don't have to make it part of the file name.
	if (!isValidTrialStatusList(current_trial_status)) {
		// Let's do a 400 here instead of 404 given it is less a mock is not found
		// but your request is broken.
		res.status(400).end();
		return;
	}

	// File naming is
	// <term>_<term_type>_<size>_<sort>

	// TODO: This needs to be sanitized.

	const agg_name_fragment = agg_name ? agg_name.toLowerCase() : 'empty';
	const size_fragment = size ? size : 'empty';
	const agg_field_fragment = agg_field ? agg_field : 'empty';
	const fileName = `${agg_field_fragment}__${agg_name_fragment}__${size_fragment}.json`;

	const mockFile = path.join(
		__dirname,
		'..',
		'..',
		'mock-data',
		'v2',
		'trials',
		fileName
	);

	try {
		await accessAsync(mockFile);
		res.sendFile(mockFile);
	} catch (err) {
		// Access denied to open file, or not found.
		// treat at 404, or your choice.
		console.error(err);
		res.status(404).end();
	}
};

/**
 * Entry point for /v2/trials requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
const mockTrials = async (req, res, next) => {
	if (req.method === 'GET') {
		return trialsGet(req, res, next);
	} else if (req.method === 'POST') {
		return trialsPost(req, res, next);
	} else {
		// Method not allowed
		res.status(405).end();
	}
};

module.exports = mockTrials;
