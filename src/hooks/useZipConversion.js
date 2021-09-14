import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const useZipConversion = (updateFunc) => {
	const [zip, setZip] = useState();
	const [isError, setIsError] = useState(false);
	const zipBase = useSelector((store) => store.globals.zipConversionEndpoint);

	useEffect(() => {
		const fetchZipCoords = async () => {
			setIsError(false);
			const url = `${zipBase}/${zip}`;
			try {
				const response = await axios.get(url);
				// if we don't get back a message, good to go
				if (response.data && !response.data.message) {
					updateFunc('zipCoords', response.data);
					updateFunc('hasInvalidZip', false);
				} else {
					updateFunc('hasInvalidZip', true);
				}
			} catch (error) {
				updateFunc('hasInvalidZip', true);
				setIsError(true);
			}
		};
		if (zip && zip !== '') {
			fetchZipCoords();
		}
	}, [zip]);

	const getZipCoords = (lookupZip) => {
		setZip(lookupZip);
	};
	return [{ getZipCoords, isError }];
};
