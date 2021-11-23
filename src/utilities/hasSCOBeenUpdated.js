import { defaultSCOState } from '../constants';

export const hasSCOBeenUpdated = (searchCriteriaObject) => {
	const SCOcomparator = {
		...searchCriteriaObject,
		formType: '',
		resultsPage: 0,
	};
	return JSON.stringify(defaultSCOState) === JSON.stringify(SCOcomparator);
};
