import { ACTIVE_TRIAL_STATUSES } from '../../../constants';
import { searchPriorTherapyAction } from '../searchPriorTherapyAction';

describe('searchPriorTherapyAction', () => {
	it('should match the returned object', () => {
		const searchText = 'cisplatin';

		const requestQuery = {
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			sort: 'count',
			order: 'desc',
			category: ['Agent', 'Agent Category', 'Other'],
			name: searchText,
			size: 10,
		};

		const expectedAction = {
			type: '@@api/CTSv2',
			payload: {
				service: 'ctsSearchV2',
				cacheKey: 'priorTherapyOptions',
				method: 'searchPriorTherapy',
				requestParams: requestQuery,
			},
		};

		expect(searchPriorTherapyAction({ searchText })).toEqual(expectedAction);
	});

	it('handles exception when called without a search text parameter', () => {
		expect(() => {
			searchPriorTherapyAction({ searchText: null });
		}).toThrow('You must specify a prior therapy in order to fetch it.');
	});

	it('handles exception when called with empty string search text', () => {
		expect(() => {
			searchPriorTherapyAction({ searchText: '' });
		}).toThrow('You must specify a prior therapy in order to fetch it.');
	});
});
