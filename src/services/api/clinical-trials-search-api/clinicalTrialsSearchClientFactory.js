import axios from 'axios';

/**
 * Determines the appropriate adapter based on the environment
 * @returns {string|undefined} The adapter to use, or undefined to let axios auto-select
 */
const getAdapter = () => {
	// Check if we're in a Jest test environment
	if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
		return 'http'; // Jest test environment
	}
	// Check if we're in a Node.js environment (server-side)
	if (typeof window === 'undefined') {
		return 'http'; // Node.js environment
	}
	// Browser environment - let axios auto-select the appropriate adapter
	return undefined;
};

/**
 * Gets an instance of a Clinical Trial Search API client
 *
 * @param {string} apiBase the base url of the API
 */
const clinicalTrialsSearchClientFactory = (apiBase) => {
	const config = {
		baseURL: apiBase,
		timeout: 15000,
	};

	// Only set adapter if we're in Node.js environment
	const adapter = getAdapter();
	if (adapter) {
		config.adapter = adapter;
	}

	return axios.create(config);
};

export default clinicalTrialsSearchClientFactory;
