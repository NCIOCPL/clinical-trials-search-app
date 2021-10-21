import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchTrials } from '../store/actions';
import { formatTrialSearchQuery } from '../utilities';

export const useStoreToFindTrials = () => {
	const dispatch = useDispatch();
	const currentForm = useSelector((store) => store.form);
	const [queryParamString, setQueryParamString] = useState('');

	useEffect(() => {
		if (queryParamString !== '') {
			dispatch(
				searchTrials({
					cacheKey: queryParamString,
					data: formatTrialSearchQuery(currentForm),
				})
			);
		}
	}, [queryParamString]);

	const fetchTrials = (qs) => {
		setQueryParamString(qs);
	};

	return [{ fetchTrials }];
};
