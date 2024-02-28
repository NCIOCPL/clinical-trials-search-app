import { queryStringToSearchCriteria } from '../queryStringToSearchCriteria';
import { defaultState } from './defaultStateCopy';

describe('Basic - queryStringToSearchCriteria maps query to form', () => {
	const diseaseFetcher = async () => [];
	const interventionsFetcher = async () => [];
	const zipcodeFetcher = async () => null;

	// Store original location
	const originalLocation = window.location;

	beforeEach(() => {
		// Reset to a default location before each test
		delete window.location;
		window.location = {
			...originalLocation,
			pathname: '/',
		};
	});

	afterAll(() => {
		// Restore original location
		window.location = originalLocation;
	});

	it('placeholder', () => {
		expect(true).toBe(true);
	});

	it('No Query works for details', async () => {
		const expected = {
			searchCriteria: defaultState,
			errors: [],
		};

		const actual = await queryStringToSearchCriteria('', diseaseFetcher, interventionsFetcher, zipcodeFetcher);
		expect(actual).toEqual(expected);
	});

	it('R=1 param works for details', async () => {
		// Set up window.location for details page
		delete window.location;
		window.location = {
			...originalLocation,
			pathname: '/research/participate/clinical-trials-search/v',
		};

		const expected = {
			searchCriteria: {
				...defaultState,
				formType: 'custom',
				qs: 'r=1',
			},
			errors: [],
		};

		const actual = await queryStringToSearchCriteria('r=1', diseaseFetcher, interventionsFetcher, zipcodeFetcher);
		expect(actual).toEqual(expected);
	});

	it('R=1 param fails for results', async () => {
		// Set up window.location for results page
		delete window.location;
		window.location = {
			...originalLocation,
			pathname: '/research/participate/clinical-trials-search/r',
		};

		const expected = {
			searchCriteria: null,
			errors: [
				{
					fieldName: 'formType',
					message: 'Results Link Flag cannot be empty on results page.',
				},
			],
		};

		const actual = await queryStringToSearchCriteria('r=1', diseaseFetcher, interventionsFetcher, zipcodeFetcher);
		expect(actual).toEqual(expected);
	});

	it('No rl fails for results', async () => {
		// Set up window.location for results page
		delete window.location;
		window.location = {
			...originalLocation,
			pathname: '/research/participate/clinical-trials-search/r',
		};

		const expected = {
			searchCriteria: null,
			errors: [
				{
					fieldName: 'formType',
					message: 'Results Link Flag cannot be empty on results page.',
				},
			],
		};

		const actual = await queryStringToSearchCriteria('', diseaseFetcher, interventionsFetcher, zipcodeFetcher);
		expect(actual).toEqual(expected);
	});
});
