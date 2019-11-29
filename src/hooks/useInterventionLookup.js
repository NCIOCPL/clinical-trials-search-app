import { useState, useEffect } from 'react';
import axios from 'axios';

export const useInterventionLookup = updateFunc => {
  const [codesList, setCodesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        'Content-Type': 'application/json',
      };
      const url = 'https://ctsproxy.cancer.gov/v1/interventions';
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

  const getInterventionByCode = codesArr => {
    setCodesList(codesArr);
  };
  return [{ getInterventionByCode }];
};
