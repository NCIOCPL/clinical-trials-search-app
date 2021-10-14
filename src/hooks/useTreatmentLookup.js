import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSettings } from '../store/store.js';

export const useTreatmentLookup = (updateFunc) => {
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
				updateFunc('treatments', response.data.terms);
			} catch (error) {
				console.error(error);
			}
		};
		if (codesList.length > 0) {
			fetchData();
		}
	}, [codesList]);

	const getTreatmentByCode = (codesArr) => {
		setCodesList(codesArr);
	};
	return [{ getTreatmentByCode }];
};
