import { getClinicalTrialsQuery } from '../getClinicalTrialsQuery';

describe('testing getClinicalTrials', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('creates a query, when given requestFilters', async () => {
		const expectedQuery = {
			type: 'getClinicalTrials',
			payload: {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'arms.interventions.intervention_code': ['C1234'],
				'primary_purpose.primary_purpose_code': 'treatment',
				from: 0,
				size: 50,
			},
		};

		const requestFilters = {
			'arms.interventions.intervention_code': ['C1234'],
			'primary_purpose.primary_purpose_code': 'treatment',
		};

		const requestQuery = getClinicalTrialsQuery({
			requestFilters,
		});

		expect(requestQuery).toMatchObject(expectedQuery);
	});

	it('creates a query without any requestFilters', async () => {
		const expectedQuery = {
			type: 'getClinicalTrials',
			payload: {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				from: 5,
				size: 20,
			},
		};

		const requestQuery = getClinicalTrialsQuery({
			from: 5,
			size: 20,
		});

		expect(requestQuery).toMatchObject(expectedQuery);
	});
});