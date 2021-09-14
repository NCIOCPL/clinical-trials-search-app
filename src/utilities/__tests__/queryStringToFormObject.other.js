import { queryStringToFormObject } from '../queryStringToFormObject';
import {
	getDiseaseFetcher,
	TYPE_EXPECTATION,
} from './queryStringToFormObject.common';
import { defaultState } from './defaultStateCopy';

describe('Basic - queryStringToFormObject maps query to form', () => {
	const diseaseFetcher = async () => [];
	const interventionsFetcher = async () => [];
	const zipcodeFetcher = async () => null;

	it('No Query works for details', () => {
		const expected = {
			formState: defaultState,
			errors: [],
		};

		return queryStringToFormObject(
			'',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		).then((actual) => {
			expect(actual).toEqual(expected);
		});
	});

	it('R=1 param works for details', () => {
		jsdom.reconfigure({
			url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI1234&r=1',
		});

		const expected = {
			formState: {
				...defaultState,
				formType: 'custom',
			},
			errors: [],
		};

		return queryStringToFormObject(
			'r=1',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		).then((actual) => {
			expect(actual).toEqual(expected);
		});
	});

	it('R=1 param fails for results', () => {
		jsdom.reconfigure({
			url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?r=1',
		});

		const expected = {
			formState: null,
			errors: [
				{
					fieldName: 'formType',
					message: 'Results Link Flag cannot be empty on results page.',
				},
			],
		};

		return queryStringToFormObject(
			'r=1',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		).then((actual) => {
			expect(actual).toEqual(expected);
		});
	});

	it('No rl fails for results', () => {
		jsdom.reconfigure({
			url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r',
		});

		const expected = {
			formState: null,
			errors: [
				{
					fieldName: 'formType',
					message: 'Results Link Flag cannot be empty on results page.',
				},
			],
		};

		return queryStringToFormObject(
			'',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		).then((actual) => {
			expect(actual).toEqual(expected);
		});
	});
});
