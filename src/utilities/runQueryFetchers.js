import { ctsapiInterventionFetcher, zipcodeFetcher } from './index';
import { getCtsApiDiseaseFetcherAction } from '../services/api/actions/ctsapiDiseaseFetcherAction';
import { ctsapiDiseaseFetcher } from '../services/api/clinical-trials-search-api';

export const runQueryFetchers = async (
	clinicalTrialsSearchClientV2,
	ctsapiclient,
	zipcodeEndpoint
) => {
	const diseaseFetcher = async (ids) => {
		const { payload } = getCtsApiDiseaseFetcherAction(ids);
		return await ctsapiDiseaseFetcher(clinicalTrialsSearchClientV2, payload);
	};
	const interventionFetcher = async (ids) =>
		await ctsapiInterventionFetcher(ctsapiclient, ids);
	const zipFetcher = async (zipcode) =>
		await zipcodeFetcher(zipcodeEndpoint, zipcode);

	return { diseaseFetcher, interventionFetcher, zipFetcher };
};
