import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useCtsApi } from '../useCtsApi';
import { useAppSettings } from '../../../store/store';
import { getClinicalTrialsAction } from '../../../services/api/actions/getClinicalTrialsAction';
import { getClinicalTrials } from '../../../services/api/clinical-trials-search-api/getClinicalTrials';

jest.mock('../../../store/store');
jest.mock(
	'../../../services/api/clinical-trials-search-api/getClinicalTrials.js'
);

/* ----------------------------------
   !!!! README !!!!
	 When adding a new action you will need to:
	 1. update the "payload.map((res, idx) => {" block below to expose
	    some information for your tests to look for in the document.
	 2. Add a new describe block for all of the tests for your action
   ----------------------------------
 */

/* eslint-disable react/prop-types */
const UseCtsApiSupportSample = ({ actions }) => {
	const { loading, payload, error, aborted } = useCtsApi(actions);

	return (
		<div>
			{(() => {
				if (!loading && payload) {
					return (
						<>
							<h1>Payload</h1>
							<ul>
								{payload.length === 0 ? (
									<div>Noop</div>
								) : (
									payload.map((res, idx) => {
										// This will look at the responses in the payload
										// and output a element for you tests to look for.
										//
										// As you add actions to useCtsApi, you need to add
										// conditions here.
										if (res === null) {
											return <li key={idx}>Payload[{idx}]: null </li>;
										} else if (res.total) {
											// Fetch Trials
											// TODO: Make this a better detection of a trial result.
											return (
												<li key={idx}>
													Payload[{idx}]-total: {res.total}
												</li>
											);
										} else {
											return <li key={idx}>Payload[{idx}]: unknown</li>;
										}
									})
								)}
							</ul>
						</>
					);
				} else if (!loading && error) {
					return <h1>Error: {error.message}</h1>;
				} else if (!loading && aborted) {
					return <h1>Aborted: This should not happen</h1>;
				} else {
					return <h1>Loading</h1>;
				}
			})()}
		</div>
	);
};

describe('tests for useCtsApi', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('noop', () => {
		it('tests and empty set of actions', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[]} />);
			});

			expect(screen.getByText('Noop')).toBeInTheDocument();
		});
	});

	describe('getClinicalTrials', () => {
		it('should fetch the data with one requestFilter in the query', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getClinicalTrials.mockReturnValue({
				total: 1,
				trials: [
					{
						brief_summary: 'first summary',
						brief_title: 'first title',
						current_trial_status: 'Active',
						nci_id: 'NCI-2015-00054',
						sites: 0,
					},
				],
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
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
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(screen.getByText('Payload[0]-total: 1')).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
			// Todo: check that the expected text is on the page.
		});

		it('should handle an AbortError when calling getClinicalTrials with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getClinicalTrials.mockImplementation(() => {
				const err = new Error('AbortError');
				err.name = 'AbortError';
				throw err;
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
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
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(
				screen.getByText('Aborted: This should not happen')
			).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		});

		it('should handle any other kind of error when calling getClinicalTrials with client and query params', async () => {
			useAppSettings.mockReturnValue([
				{
					appId: 'mockAppId',
					apiClients: { trialListingSupportClient: true },
				},
			]);

			getClinicalTrials.mockImplementation(() => {
				throw new Error('Bad Mojo');
			});

			const requestFilters = {
				'arms.interventions.intervention_code': ['C1234'],
			};

			const searchAction = getClinicalTrialsAction({
				from: 0,
				requestFilters,
				size: 1,
			});

			const expected = {
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
				from: 0,
				size: 1,
			};

			await act(async () => {
				render(<UseCtsApiSupportSample actions={[searchAction]} />);
			});

			expect(screen.getByText('Error: Bad Mojo')).toBeInTheDocument();
			expect(getClinicalTrials.mock.calls).toHaveLength(1);
			expect(getClinicalTrials.mock.calls[0][1]).toEqual(expected);
		});
	});
});
