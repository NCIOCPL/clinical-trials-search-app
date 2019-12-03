import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useCachedValues,
  useDiseaseLookup,
  useZipConversion,
  useInterventionLookup,
  useTreatmentLookup,
} from './';
import { getCancerTypeDescendents, getMainType } from '../store/actions';
import { isEmptyObj, getStateNameFromAbbr } from '../utilities';
const queryString = require('query-string');

export const useQueryToBuildStore = (
  baseQuery,
  handleUpdate,
  setStoreRehydrated
) => {
  const dispatch = useDispatch();
  const [storeObj, setStoreObj] = useState({});
  const { trialPhases, trialTypes, zipCoords, hasInvalidZip } = useSelector(
    store => store.form
  );

  const { maintypeOptions = [] } = useCachedValues(['maintypeOptions']);
  const [{ getBasicDiseaseFromCode, ctObj }] = useDiseaseLookup();
  const [cancerCode, setCancerCode] = useState('');
  const [subtypesCodes, setSubtypeCodes] = useState([]);
  const [stageCodes, setStageCodes] = useState([]);
  const [finCodes, setFinCodes] = useState([]);
  const [descendentsPopulated, setDescendentsPopulated] = useState(false);
  const [checksComplete, setChecksComplete] = useState(false);

  const [{ getZipCoords }] = useZipConversion(handleUpdate);
  const [zipCoordsRetrieved, setZipCoordsRetrieved] = useState(false);

  const [{ getInterventionByCode }] = useInterventionLookup(handleUpdate);
  const [{ getTreatmentByCode }] = useTreatmentLookup(handleUpdate);
  const [drugs, setDrugs] = useState([]);
  const [treatments, setTreatments] = useState([]);

  const [inputtedZip, setInputtedZip] = useState('');

  const cache = useSelector(store => store.cache);

  useEffect(() => {
    if (maintypeOptions.length > 0 && cancerCode !== '') {
      const mt = maintypeOptions.filter(ct => ct.codes[0] === cancerCode);
      if (mt.length > 0) {
        handleUpdate('cancerType', mt[0]);
        if (storeObj.rl === '2') {
          dispatch(
            getCancerTypeDescendents({
              cacheKey: cancerCode,
              codes: mt[0].codes,
            })
          );
        } else {
          // don't need to search if basic
          setDescendentsPopulated(true);
        }
      } else {
        console.log('maintype not found.');
      }
    }
  }, [maintypeOptions, cancerCode]);

  useEffect(() => {
    if (inputtedZip !== '') {
      getZipCoords(inputtedZip);
    }
  }, [inputtedZip]);

  useEffect(() => {
    getInterventionByCode(drugs);
  }, [drugs]);

  useEffect(() => {
    getTreatmentByCode(treatments);
  }, [treatments]);

  useEffect(() => {
    // console.log('rehydrating: ' + descendentsPopulated + ' : ' + checksComplete + ' : ' + zipCoordsRetrieved );
    if (descendentsPopulated && checksComplete && zipCoordsRetrieved) {
      setStoreRehydrated(true);
    }
  }, [descendentsPopulated, checksComplete, zipCoordsRetrieved]);

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
    setDescendentsPopulated(true);
  };

  useEffect(() => {
    if (zipCoords.lat !== '' || hasInvalidZip) {
      setZipCoordsRetrieved(true);
    }
  }, [zipCoords, hasInvalidZip]);

  useEffect(() => {
    if (cache[cancerCode]) {
      populateDescendents();
    }
  }, [cache[cancerCode]]);

  useEffect(() => {
    if (!isEmptyObj(ctObj)) {
      handleUpdate('cancerType', ctObj);
      setDescendentsPopulated(true);
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

      //page number
      if (storeObj.pn && storeObj.pn !== '') {
        handleUpdate('resultsPage', parseInt(storeObj.pn) - 1);
      }

      if (formType === 'basic') {
        //zip
        if (storeObj.z && storeObj.z !== '') {
          handleUpdate('zip', storeObj.z);
          getZipCoords(storeObj.z);
        } else {
          setZipCoordsRetrieved(true);
        }

        // cancerType
        if (storeObj.t && storeObj.t !== '') {
          setCancerCode(storeObj.t);
          getBasicDiseaseFromCode(storeObj.t);
        } else {
          setDescendentsPopulated(true);
        }
      } else {
        // cancerType
        if (storeObj.t && storeObj.t !== '') {
          setCancerCode(storeObj.t);
          dispatch(getMainType({}));
        } else {
          setDescendentsPopulated(true);
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

        if (storeObj.d && storeObj.d.length > 0) {
          if (Array.isArray(storeObj.d)) {
            setDrugs([...storeObj.d]);
          } else {
            let y = [];
            y.push(storeObj.d);
            setDrugs(y);
          }
        }

        if (storeObj.i && storeObj.i.length) {
          if (Array.isArray(storeObj.i)) {
            setTreatments([...storeObj.i]);
          } else {
            let y = [];
            y.push(storeObj.i);
            setTreatments(y);
          }
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
              setZipCoordsRetrieved(true);
              break;
            case 3:
              loc = 'search-location-hospital';
              //hospital
              if (storeObj.hos && storeObj.hos !== '') {
                handleUpdate('hospital', { term: storeObj.hos });
              }
              setZipCoordsRetrieved(true);
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
                let statesArr = [];
                if (Array.isArray(storeObj.lst)) {
                  statesArr = [...storeObj.lst];
                } else {
                  statesArr.push(storeObj.lst);
                }
                let s = [];
                statesArr.forEach(st => {
                  let newState = {
                    abbr: st,
                    name: getStateNameFromAbbr(st),
                  };
                  s.push(newState);
                });
                handleUpdate('states', [...s]);
              }
              setZipCoordsRetrieved(true);
              break;
            case 1:
              loc = 'search-location-zip';
              //zip
              if (storeObj.z && storeObj.z !== '') {
                handleUpdate('zip', storeObj.z);
                getZipCoords(storeObj.z);
              } else {
                setZipCoordsRetrieved(true);
              }

              //zip Radius
              if (storeObj.zp && storeObj.zp !== 100) {
                handleUpdate('zipRadius', storeObj.zp);
              }
              break;
            case 0:
            default:
              loc = 'search-location-all';
              setZipCoordsRetrieved(true);
          }
          handleUpdate('location', loc);
        }
      }
    }
    setChecksComplete(true);
  }, [storeObj]);

  return [{ buildStoreFromQuery }];
};
