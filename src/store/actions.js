// import querystring from 'query-string';
import {
	UPDATE_FORM_FIELD,
	UPDATE_FORM,
	UPDATE_FORM_SEARCH_CRITERIA,
	CLEAR_FORM,
	RECEIVE_DATA,
} from './identifiers';

import { ACTIVE_TRIAL_STATUSES } from '../constants';

/**
 * Facade wrapping a ClinicalTrialsService instance to create app specific methods
 * and simplify interacting with API.  Ported from ctapi-facade.ts from WCMS
 */

export function updateFormField({ field, value }) {
	return {
		type: UPDATE_FORM_FIELD,
		payload: {
			field,
			value,
		},
	};
}

export function updateForm(newState) {
	return {
		type: UPDATE_FORM,
		payload: newState,
	};
}

export function updateFormSearchCriteria(newState) {
	return {
		type: UPDATE_FORM_SEARCH_CRITERIA,
		payload: newState,
	};
}

export function receiveData(cacheKey, value) {
	return {
		type: RECEIVE_DATA,
		payload: {
			cacheKey,
			value,
		},
	};
}

export function clearForm() {
	return {
		type: CLEAR_FORM,
	};
}

export function getDiseasesForSimpleTypeAhead({
	name,
	size = 10,
	isDebug = false,
}) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'diseases',
			requests: [
				{
					method: 'getDiseases',
					requestParams: {
						category: ['maintype', 'subtype', 'stage'],
						ancestorId: undefined,
						additionalParams: {
							name,
							size,
							sort: 'cancergov',
							current_trial_status: ACTIVE_TRIAL_STATUSES,
						},
					},
					fetchHandlers: {
						formatResponse: (res) => {
							let diseases = [...res];

							// TODO: DEBUG
							if (isDebug) {
								diseases.forEach(
									(disease) =>
										(disease.name += ' (' + disease.codes.join('|') + ')')
								);
							}

							return diseases;
						},
					},
				},
			],
		},
	};
}

export function getCancerTypeDescendents({ cacheKey, codes }) {
	return {
		type: '@@cache/RETRIEVE',
		payload: {
			service: 'ctsSearch',
			cacheKey,
			requests: [getFindings({ ancestorId: codes })],
		},
	};
}

/**
 * Gets cancer findings based on parent ID
 */
export function getFindings({ ancestorId, size = 0, isDebug = false }) {
	return {
		type: '@@cache/RETRIEVE',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'findingsOptions',
			requests: [
				{
					method: 'getDiseases',
					requestParams: {
						category: 'finding',
						ancestorId: ancestorId,
						additionalParams: {
							size,
							current_trial_status: ACTIVE_TRIAL_STATUSES,
						},
					},
					fetchHandlers: {
						formatResponse: (diseases) => {
							// TODO: DEBUG
							if (isDebug) {
								diseases.forEach(
									(disease) =>
										(disease.name += ' (' + disease.codes.join('|') + ')')
								);
							}
							return diseases;
						},
					},
				},
			],
		},
	};
}

/**
 * Gets drugs intervention items for search field
 */
export function searchDrugs({ searchText, isDebug = false, size = 10 } = {}) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'drugOptions',

			requests: [
				{
					method: 'getInterventions',
					requestParams: {
						category: ['Agent', 'Agent Category'],
						name: searchText,
						size: size,
						additionalParams: {
							current_trial_status: ACTIVE_TRIAL_STATUSES,
						},
						sort: 'cancergov',
					},
					fetchHandlers: {
						formatResponse: (drugs) => {
							if (isDebug) {
								drugs.forEach(
									(drug) => (drug.name += ' (' + drug.codes.join('|') + ')')
								);
							}
							return drugs;
						},
					},
				},
			],
		},
	};
}

/**
 * Gets other intervention items for search field
 */
export function searchOtherInterventions({ searchText, size = 10 } = {}) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'treatmentOptions',
			requests: [
				{
					method: 'getInterventions',
					requestParams: {
						category: 'Other',
						name: searchText,
						size: size,
						additionalParams: {
							current_trial_status: ACTIVE_TRIAL_STATUSES,
						},
						sort: 'cancergov',
					},
					fetchHandlers: {
						formatResponse: (treatments, isDebug) => {
							if (isDebug) {
								treatments.forEach(
									(treatment) =>
										(treatment.name += ' (' + treatment.codes.join('|') + ')')
								);
							}
							return treatments;
						},
					},
				},
			],
		},
	};
}

/**
 * Gets trial investigators to populate the Trial Investigators field
 */
export function searchTrialInvestigators({ searchText, size = 10 } = {}) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'tis',
			requests: [
				{
					method: 'getTerms',
					requestParams: {
						category: 'principal_investigator',
						additionalParams: {
							term: searchText,
							sort: 'term',
							current_trial_statuses: ACTIVE_TRIAL_STATUSES,
						},
						size,
					},
				},
			],
		},
	};
}

export function searchTrials({ cacheKey, data }) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: cacheKey,
			requests: [
				{
					method: 'searchTrials',
					requestParams: {
						document: JSON.stringify(data),
					},
				},
			],
		},
	};
}
