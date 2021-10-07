import { queryStringToFormObject } from '../queryStringToFormObject';
import { defaultState } from './defaultStateCopy';

describe('Basic - queryStringToFormObject maps query to form', () => {
	const diseaseFetcher = async () => [];
	const interventionsFetcher = async () => [];
	const zipcodeFetcher = async () => null;

	it('No Query works for details', async () => {
		const expected = {
			formState: defaultState,
			errors: [],
		};

		const actual = await queryStringToFormObject(
			'',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		);
		expect(actual).toEqual(expected);
	});

	it('R=1 param works for details', async () => {
		global.jsdom.reconfigure({
			url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=NCI1234&r=1',
		});

		const expected = {
			formState: {
				...defaultState,
				formType: 'custom',
			},
			errors: [],
		};

		const actual = await queryStringToFormObject(
			'r=1',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		);
		expect(actual).toEqual(expected);
	});

	it('R=1 param fails for results', async () => {
		global.jsdom.reconfigure({
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

		const actual = await queryStringToFormObject(
			'r=1',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		);
		expect(actual).toEqual(expected);
	});

	it('No rl fails for results', async () => {
		global.jsdom.reconfigure({
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

		const actual = await queryStringToFormObject(
			'',
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher
		);
		expect(actual).toEqual(expected);
	});
});
