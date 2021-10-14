import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppSettings } from '../store/store.js';

export const useInterventionLookup = (updateFunc) => {
	const [{ ctsProtocol, ctsHost, ctsPort }] = useAppSettings();

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
			} catch (error) {
				console.error(error);
			}
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
