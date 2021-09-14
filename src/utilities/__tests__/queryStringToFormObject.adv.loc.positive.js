import { queryStringToFormObject } from '../queryStringToFormObject';
import { defaultState } from './defaultStateCopy';

describe('Adv - Locations - queryStringToFormObject maps query to form', () => {
	const goodMappingTestCases = [
		[
			'NIH Clinical Center',
			'?loc=4&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-nih',
				formType: 'advanced',
			},
		],
		[
			'Hospital',
			'?loc=3&hos=M+D+Anderson+Cancer+Center&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-hospital',
				hospital: {
					term: 'M D Anderson Cancer Center',
					termKey: 'M D Anderson Cancer Center',
				},
				formType: 'advanced',
			},
		],
		[
			'Hospital with commas',
			'?loc=3&hos=Hospital+Name,Hospital+Place&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-hospital',
				hospital: {
					term: 'Hospital Name,Hospital Place',
					termKey: 'Hospital Name,Hospital Place',
				},
				formType: 'advanced',
			},
		],
		[
			'CCS - country only',
			'?loc=2&lcnty=Canada&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				country: 'Canada',
				formType: 'advanced',
			},
		],
		[
			'CCS - city only',
			'?loc=2&lcnty=United+States&lcty=Baltimore&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				city: 'Baltimore',
				country: 'United States',
				formType: 'advanced',
			},
		],
		[
			'CCS - states only, one state',
			'?loc=2&lcnty=United+States&lst=MD&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				states: [{ abbr: 'MD', name: 'Maryland' }],
				country: 'United States',
				formType: 'advanced',
			},
		],
		[
			'CCS - states only, multi state',
			'?loc=2&lcnty=United+States&lst=MD&lst=VA&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				states: [
					{ abbr: 'MD', name: 'Maryland' },
					{ abbr: 'VA', name: 'Virginia' },
				],
				country: 'United States',
				formType: 'advanced',
			},
		],
		[
			'CCS - states only, multi state - old description page style',
			'?loc=2&lcnty=United+States&lst=MD,VA&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				states: [
					{ abbr: 'MD', name: 'Maryland' },
					{ abbr: 'VA', name: 'Virginia' },
				],
				country: 'United States',
				formType: 'advanced',
			},
		],
		[
			'CCS - states only, multi state - old description page style spaces and commas',
			'?loc=2&lcnty=United+States&lst=MD,  ,  ,VA&rl=2',
			async () => [],
			async () => [],
			async () => null,
			{
				location: 'search-location-country',
				states: [
					{ abbr: 'MD', name: 'Maryland' },
					{ abbr: 'VA', name: 'Virginia' },
				],
				country: 'United States',
				formType: 'advanced',
			},
		],
		[
			'Zip - just a zip',
			'?loc=1&z=20850&rl=2',
			async () => [],
			async () => [],
			async (zip) => ({ lat: 39.0897, long: -77.1798 }),
			{
				location: 'search-location-zip',
				zip: '20850',
				zipCoords: { lat: 39.0897, long: -77.1798 },
				formType: 'advanced',
			},
		],
		[
			'Zip - zip + zip',
			'?loc=1&z=20850&zp=500&rl=2',
			async () => [],
			async () => [],
			async (zip) => ({ lat: 39.0897, long: -77.1798 }),
			{
				location: 'search-location-zip',
				zip: '20850',
				zipCoords: { lat: 39.0897, long: -77.1798 },
				zipRadius: 500,
				formType: 'advanced',
			},
		],
	];

	// Test iterates over multiple cases defined by mappingTestCases
	it.each(goodMappingTestCases)(
		'%# - correctly maps %s',
		(
			testName,
			urlQuery,
			diseaseFetcher,
			interventionsFetcher,
			zipcodeFetcher,
			additionalExpectedQuery
		) => {
			const expected = {
				formState: {
					...defaultState,
					...additionalExpectedQuery,
				},
				errors: [],
			};

			return queryStringToFormObject(
				urlQuery,
				diseaseFetcher,
				interventionsFetcher,
				zipcodeFetcher
			).then((actual) => {
				expect(actual).toEqual(expected);
			});
		}
	);
});
