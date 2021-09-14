import axios from 'axios';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export const useInterventionLookup = (updateFunc) => {
	const { ctsProtocol, ctsHost, ctsPort } = useSelector(
		(store) => store.globals
	);
	const [codesList, setCodesList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const headers = {
				'Content-Type': 'application/json',
			};
			const url = `${ctsProtocol}://${ctsHost}${
				ctsPort ? ':' + ctsPort : ''
			}/v1/interventions`;
			try {
				const response = await axios.post(
					url,
					{ code: codesList },
					{
						headers: headers,
					}
				);
				updateFunc('drugs', response.data.terms);
			} catch (error) {}
		};
		if (codesList.length > 0) {
			fetchData();
		}
	}, [codesList]);

	const getInterventionByCode = (codesArr) => {
		setCodesList(codesArr);
	};
	return [{ getInterventionByCode }];
};
