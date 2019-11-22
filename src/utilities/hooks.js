import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deepSearchObject, getStateNameFromAbbr, isEmptyObj } from './utilities';
import { getMainType, getCancerTypeDescendents } from '../store/actions';
import axios from 'axios';
const queryString = require('query-string');

// Hooks to share common logic between multiple components

export const useCachedValues = cacheKeys => {
  const [currentVals, setCurrentVals] = useState({
    ...cacheKeys.map(key => ({ [key]: [] })),
  });
  const cache = useSelector(store => store.cache);
  useEffect(() => {
    const newVals = Object.assign(
      {},
      ...cacheKeys.map(key => {
        const result = deepSearchObject(key, cache);
        return { [key]: result[0] || [] };
      })
    );
    setCurrentVals(newVals);
  }, [cache]);
  return currentVals;
};

export const useChipList = (chiplistName, handleUpdate) => {
  const list = useSelector(store => store.form[chiplistName]);
  const [chips, setChips] = useState([]);
  useEffect(() => {
    handleUpdate(chiplistName, [...chips]);
  }, [chips, chiplistName, handleUpdate]);
  const add = item => {
    //prevent dupes
    const newChips = [...chips, { label: item }];
    setChips([...new Set(newChips)]);
  };
  const remove = item => {
    let newChips = chips.filter(value => {
      return value.label !== item;
    });
    setChips([...newChips]);
  };

  return {
    list,
    add,
    remove,
  };
};

// showing and hiding a react modal component
export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  function toggleModal() {
    setIsShowing(!isShowing);

    if (!isShowing) {
      document.getElementById('main-content').classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
  return {
    isShowing,
    toggleModal,
  };
};

// fetches cache id for clinical trials print service
export const usePrintApi = (idList = {}, printAPIUrl = '') => {
  const [data, setData] = useState({});
  const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      const headers = {
        'Content-Type': 'application/json',
      };
      try {
        const result = await axios.post(url, idList, {
          headers: headers,
        });
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    if (url && url !== '') {
      fetchData();
    }
  }, [url]);

  const doPrint = () => {
    setUrl(printAPIUrl);
  };

  return [{ data, isLoading, isError, doPrint }];
};

export const useZipConversion = (lookupZip, updateFunc) => {
  const [zip, setZip] = useState();
  const [isError, setIsError] = useState(false);
  const zipBase = useSelector(store => store.globals.zipConversionEndpoint);

  useEffect(() => {
    const fetchZipCoords = async () => {
      setIsError(false);
      const url = `${zipBase}/${lookupZip}`;
      try {
        const response = await axios.get(url);
        // if we don't get back a message, good to go
        if (response.data && !response.data.message) {
          updateFunc('zipCoords', response.data);
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

  const getZipCoords = () => {
    setZip(lookupZip);
  };
  return [{ getZipCoords, isError }];
};

export const useDiseaseLookup = () => {
  const [ctCode, setCtCode] = useState('');
  const [ctObj, setCtObj] = useState({});

  useEffect(() => {
    const fetchDisease = async () => {
      const url = 'https://clinicaltrialsapi.cancer.gov/v1/diseases';
      try {
        const response = await axios.get(url, { code: ctCode });
        setCtObj(response.data.terms[0]);
      } catch (error) {}
    };
    if (ctCode !== '') {
      fetchDisease();
    }
  }, [ctCode]);

  const getBasicDiseaseFromCode = diseaseCode => {
    setCtCode(diseaseCode);
  };

  return [{ getBasicDiseaseFromCode, ctObj }];
};

export const useInterventionLookup = (updateFunc) => {
  const [codesList, setCodesList] = useState([]);
  const [updater, setUpdater] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        'Content-Type': 'application/json',
      };
      const url = 'https://ctsproxy.cancer.gov/v1/interventions';
      try {
        const response = await axios.post(url, { code: codesList }, {
          headers: headers,
        });
        updateFunc('drugs', response.data.terms);
      } catch (error) {}
    };
    if(codesList.length > 0){
      fetchData();
    }
  }, [codesList]);

  const getInterventionByCode = (codesArr) => {
    setCodesList(codesArr);
  }
  return [{getInterventionByCode}];
}


export const useTreatmentLookup = (updateFunc) => {
  const [codesList, setCodesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        'Content-Type': 'application/json',
      };
      const url = 'https://ctsproxy.cancer.gov/v1/interventions';
      try {
        const response = await axios.post(url, { code: codesList }, {
          headers: headers,
        });
        updateFunc('treatments', response.data.terms);
      } catch (error) {}
    };
    if(codesList.length > 0){
      fetchData();
    }
  }, [codesList]);

  const getTreatmentByCode = (codesArr) => {
    setCodesList(codesArr);
  }
  return [{getTreatmentByCode}];
}

export const useQueryToBuildStore = (baseQuery, handleUpdate, setStoreRehydrated) => {
  const dispatch = useDispatch();
  const [storeObj, setStoreObj] = useState({});
  const { trialPhases, trialTypes } = useSelector(store => store.form);

  const { maintypeOptions = [] } = useCachedValues(['maintypeOptions']);
  const [{ getBasicDiseaseFromCode, ctObj }] = useDiseaseLookup();
  const [cancerCode, setCancerCode] = useState('');
  const [subtypesCodes, setSubtypeCodes] = useState([]);
  const [stageCodes, setStageCodes] = useState([]);
  const [finCodes, setFinCodes] = useState([]);

  const [{getInterventionByCode}] = useInterventionLookup(handleUpdate);
  const [{getTreatmentByCode}] = useTreatmentLookup(handleUpdate);
  const [drugs, setDrugs] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const cache = useSelector(store => store.cache);

  useEffect(() => {
    if (maintypeOptions.length > 0 && cancerCode !== '') {
      const mt = maintypeOptions.filter(ct => ct.codes[0] === cancerCode);
      if (mt.length > 0) {
        handleUpdate('cancerType', mt[0]);
        dispatch(
          getCancerTypeDescendents({
            cacheKey: cancerCode,
            codes: mt[0].codes,
          })
        );
      } else {
        console.log('maintype not found.');
      }
    }
  }, [maintypeOptions, cancerCode]);

  useEffect(() => {
    getInterventionByCode(drugs);
  }, [drugs]);
  
  useEffect(() => {
    getTreatmentByCode(treatments);
  }, [treatments]);

  const populateDescendents = () => {
    const cacheSnapshot = cache[cancerCode];
    if (subtypesCodes.length > 0) {
      const x = cacheSnapshot.subtypeOptions.filter(c =>
        subtypesCodes.includes(c.codes[0])
      );
      handleUpdate('subtypes', x);
    }
    if (stageCodes.length > 0) {
      const x = cacheSnapshot.stageOptions.filter(c =>
        stageCodes.includes(c.codes[0])
      );
      handleUpdate('stages', [...x]);
    }
    if (finCodes.length > 0) {
      const x = cacheSnapshot.findingsOptions.filter(c =>
        finCodes.includes(c.codes[0])
      );
      handleUpdate('findings', [...x]);
    }
  };

  useEffect(() => {
    if (cache[cancerCode]) {
      populateDescendents();
    }
  }, [cache[cancerCode]]);

  useEffect(() => {
    if (!isEmptyObj(ctObj)) {
      handleUpdate('cancerType', ctObj);
    }
  }, [ctObj]);

  const buildStoreFromQuery = () => {
    setStoreObj(queryString.parse(baseQuery));
  };

  useEffect(() => {
    if (
      Object.entries(storeObj).length === 0 &&
      storeObj.constructor === Object
    ) {
    } else {
      //console.log('storeObj: ' + JSON.stringify(storeObj));
      let formType = 'basic';
      //formType is advanced
      if (storeObj.rl && storeObj.rl === '2') {
        handleUpdate('formType', 'advanced');
        formType = 'advanced';
      }

      //age
      if (storeObj.a && storeObj.a !== '') {
        handleUpdate('age', storeObj.a);
      }

      //keywordPhrases
      if (storeObj.q && storeObj.q !== '') {
        handleUpdate('keywordPhrases', storeObj.q);
      }
      if (formType === 'basic') {
        //zip
        if (storeObj.z && storeObj.z !== '') {
          handleUpdate('zip', storeObj.z);
        }
        // cancerType
        if (storeObj.t && storeObj.t !== '') {
          setCancerCode(storeObj.t);
          getBasicDiseaseFromCode(storeObj.t);
        }
      } else {
        // cancerType
        if (storeObj.t && storeObj.t !== '') {
          setCancerCode(storeObj.t);
          dispatch(getMainType({}));
        }
        // subtype
        if (storeObj.st && storeObj.st !== '') {
          if (Array.isArray(storeObj.st)) {
            setSubtypeCodes([...storeObj.st]);
          } else {
            let z = [];
            z.push(storeObj.st);
            setSubtypeCodes([...z]);
          }
        }
        if (storeObj.stg && storeObj.stg !== '') {
          if (Array.isArray(storeObj.stg)) {
            setStageCodes([...storeObj.stg]);
          } else {
            let z = [];
            z.push(storeObj.stg);
            setStageCodes([...z]);
          }
        }
        if (storeObj.fin && storeObj.fin !== '') {
          if (Array.isArray(storeObj.fin)) {
            setFinCodes([...storeObj.fin]);
          } else {
            let z = [];
            z.push(storeObj.fin);
            setFinCodes([...z]);
          }
        }

        //trialId
        if (storeObj.tid && storeObj.tid !== '') {
          handleUpdate('trialId', storeObj.tid);
        }
        //investigator
        if (storeObj.in && storeObj.in !== '') {
          handleUpdate('investigator', { term: storeObj.in });
        }
        //leadorg
        if (storeObj.lo && storeObj.lo !== '') {
          handleUpdate('leadOrg', { term: storeObj.lo });
        }

        //healthyVolunteers
        if (storeObj.hv && storeObj.hv === '1') {
          handleUpdate('healthyVolunteers', true);
        }
        //va
        if (storeObj.va && storeObj.va === '1') {
          handleUpdate('vaOnly', true);
        }
        //nih
        if (storeObj.nih && storeObj.nih === '1') {
          handleUpdate('nihOnly', true);
        }

        if(storeObj.d && storeObj.d.length > 0) {
          setDrugs(storeObj.d);
        }

        if(storeObj.i && storeObj.i.length) {
          setTreatments(storeObj.i);
        }

        //trialPhases
        if (storeObj.tp && storeObj.tp.length > 0) {
          const filtered = trialPhases.map(phase => {
            if (storeObj.tp.includes(phase.value.toUpperCase())) {
              return {
                ...phase,
                checked: true,
              };
            } else {
              return phase;
            }
          });
          handleUpdate('trialPhases', [...filtered]);
        }

        // trialTypes
        if (storeObj.tt && storeObj.tt.length > 0) {
          const filtered = trialTypes.map(trialtype => {
            if (storeObj.tt.includes(trialtype.value)) {
              return {
                ...trialtype,
                checked: true,
              };
            } else {
              return trialtype;
            }
          });
          handleUpdate('trialTypes', [...filtered]);
        }

        // location
        if (storeObj.loc && storeObj.loc) {
          let loc = '';
          switch (parseInt(storeObj.loc)) {
            case 4:
              loc = 'search-location-nih';
              break;
            case 3:
              loc = 'search-location-hospital';
              //hospital
              if (storeObj.hos && storeObj.hos !== '') {
                handleUpdate('hospital', { term: storeObj.hos });
              }
              break;
            case 2:
              loc = 'search-location-country';
              // country
              if (storeObj.lcnty && storeObj.lcnty !== '') {
                handleUpdate('country', storeObj.lcnty);
              }
              // city
              if (storeObj.lcty && storeObj.lcty !== '') {
                handleUpdate('city', storeObj.lcty);
              }
              //states
              if (storeObj.lst && storeObj.lst.length > 0) {
                let s = [];
                storeObj.lst.forEach(st => {
                  let newState = {
                    abbr: st,
                  name: getStateNameFromAbbr(st)};
                  s.push(newState);
                })

                handleUpdate('states', [...s]);
              }
              break;
            case 1:
              loc = 'search-location-zip';
              //zip
              if (storeObj.z && storeObj.z !== '') {
                handleUpdate('zip', storeObj.z);
              }
              //zip Radius
              if (storeObj.zp && storeObj.zp !== 100) {
                handleUpdate('zipRadius', storeObj.zp);
              }
              break;
            case 0:
            default:
              loc = 'search-location-all';
          }
          handleUpdate('location', loc);
        }
      }
    }
    if(!isEmptyObj(storeObj)){
      setStoreRehydrated(true)
    }
    
  }, [storeObj]);

  return [{ buildStoreFromQuery }];
};

