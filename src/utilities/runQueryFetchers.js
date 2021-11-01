import {
	ctsapiDiseaseFetcher,
	ctsapiInterventionFetcher,
	zipcodeFetcher,
} from './index';

export const runQueryFetchers = async (ctsapiclient, zipcodeEndpoint) => {
	const diseaseFetcher = async (ids) =>
		await ctsapiDiseaseFetcher(ctsapiclient, ids);
	const interventionFetcher = async (ids) =>
		await ctsapiInterventionFetcher(ctsapiclient, ids);
	const zipFetcher = async (zipcode) =>
		await zipcodeFetcher(zipcodeEndpoint, zipcode);

	return { diseaseFetcher, interventionFetcher, zipFetcher };
};
