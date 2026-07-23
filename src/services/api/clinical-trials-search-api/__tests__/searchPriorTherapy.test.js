import querystring from 'querystring';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { searchPriorTherapy } from '../searchPriorTherapy';
import { searchPriorTherapyAction } from '../../../../store/actionsV2';

const client = clinicalTrialsSearchClientFactory('http://example.org');

const baseRequestQuery = (searchText) => ({
	current_trial_status: ACTIVE_TRIAL_STATUSES,
	sort: 'count',
	order: 'desc',
	category: ['Agent', 'Agent Category', 'Other'],
	name: searchText,
	size: 10,
});

describe('searchPriorTherapy', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	it('makes a request to the api and matches returned result for specified search text', async () => {
		const searchText = 'cis';
		const query = searchPriorTherapyAction({ searchText });
		const requestQuery = baseRequestQuery(searchText);

		const result = {
			data: [
				{
					name: 'Cisplatin',
					codes: ['C376'],
					category: ['agent'],
					type: ['drug'],
					synonyms: ['Cisplatin', 'CDDP'],
					count: 200,
				},
			],
			total: 1,
		};

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(200, result);

		const response = await searchPriorTherapy(client, query.payload.requestParams);

		expect(response).toEqual(result);
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const searchText = 'cis';
		const query = searchPriorTherapyAction({ searchText });
		const requestQuery = baseRequestQuery(searchText);

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(searchPriorTherapy(client, query.payload.requestParams)).rejects.toThrow('Unexpected status 204 for fetching prior therapies');
		scope.isDone();
	});

	it('throws a 404 error', async () => {
		const searchText = 'cis';
		const query = searchPriorTherapyAction({ searchText });
		const requestQuery = baseRequestQuery(searchText);

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(404);
		await expect(searchPriorTherapy(client, query.payload.requestParams)).rejects.toThrow('Unexpected status 404 for fetching prior therapies');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const searchText = 'cis';
		const query = searchPriorTherapyAction({ searchText });
		const requestQuery = baseRequestQuery(searchText);

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(searchPriorTherapy(client, query.payload.requestParams)).rejects.toThrow('Unexpected status 500 for fetching prior therapies');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const searchText = 'cis';
		const query = searchPriorTherapyAction({ searchText });
		const requestQuery = baseRequestQuery(searchText);

		const scope = nock('http://example.org')
			.get(`/interventions?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(searchPriorTherapy(client, query.payload.requestParams)).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
