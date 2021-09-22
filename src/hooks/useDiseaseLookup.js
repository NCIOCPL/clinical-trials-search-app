import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDiseaseLookup = () => {
	const [ctCode, setCtCode] = useState('');
	const [ctObj, setCtObj] = useState({});

	useEffect(() => {
		const fetchDisease = async () => {
			const url = `https://clinicaltrialsapi.cancer.gov/v1/diseases?code=${ctCode}`;
			try {
				const response = await axios.get(url);
				setCtObj(response.data.terms[0]);
			} catch (error) {
				console.error(error);
			}
		};
		if (ctCode !== '') {
			fetchDisease();
		}
	}, [ctCode]);

	const getBasicDiseaseFromCode = (diseaseCode) => {
		setCtCode(diseaseCode);
	};

	return [{ getBasicDiseaseFromCode, ctObj }];
};
