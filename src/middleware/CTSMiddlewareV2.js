import { receiveData } from '../store/actions';
import { getLeadOrg } from '../services/api/clinical-trials-search-api';

/**
 * This middleware serves two purposes (and could perhaps be broken into two pieces).
 * 1. To set up API requests with all the appropriate settings
 * 2. To handle the attendant responses and failures. Successful requests will need to be cached and then
 * sent to the store. Failures will need to be taken round back and shot.
 * @param {Object} services
 */
const createCTSMiddlewareV2 =
	(client) =>
	({ dispatch }) =>
	(next) =>
	async (action) => {
		next(action);

		if (action.type !== '@@api/CTSv2') {
			return;
		}

		const getAllRequests = async (fetchAction) => {
			const requests = () => {
				const { method, requestParams } = fetchAction.payload;

				// Switch block for api calls with default case
				switch (method) {
					case 'getLeadOrg': {
						return getLeadOrg(client, requestParams);
					}
					default: {
						throw new Error(`Unknown CTS API request`);
					}
				}
			};
			const responses = await requests();
			return responses;
		};

		if (client !== null && action.payload) {
			try {
				const results = await getAllRequests(action);
				dispatch(receiveData(action.payload.cacheKey, results));
			} catch (err) {
				console.log(err);
			}
		}
	};

export default createCTSMiddlewareV2;
