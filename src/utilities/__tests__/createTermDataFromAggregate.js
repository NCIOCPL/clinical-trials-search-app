import { createTermDataFromAggregate } from '../createTermDataFromAggregate';

describe('createTermDataFromAggregate', () => {
	it('should check returned array matches expected shape', () => {
		const data = [
			{ key: 'Test Key 1' },
			{ key: 'Test Key 2' },
			{ key: 'Test Key 3' },
		];

		const expectedData = [
			{ term: 'Test Key 1', termKey: 'Test Key 1' },
			{ term: 'Test Key 2', termKey: 'Test Key 2' },
			{ term: 'Test Key 3', termKey: 'Test Key 3' },
		];

		expect(createTermDataFromAggregate(data)).toEqual(expectedData);
	});

	it('should return an empty array when key property is not present in array of objects', () => {
		const data = [
			{ item: 'Test Key 1' },
			{ item: 'Test Key 2' },
			{ item: 'Test Key 3' },
		];

		expect(createTermDataFromAggregate(data)).toEqual([]);
	});

	it('should return an empty array if called without a parameter, or if array parameter provided is empty', () => {
		expect(createTermDataFromAggregate()).toEqual([]);
		expect(createTermDataFromAggregate([])).toEqual([]);
	});
});
