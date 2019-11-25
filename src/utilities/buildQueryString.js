export const buildQueryString = formStore => {
    const {
      formType,
      age,
      keywordPhrases,
      zip,
      zipRadius,
      cancerType,
      subtypes,
      stages,
      findings,
      country,
      location,
      city,
      states,
      hospital,
      healthyVolunteers,
      nihOnly,
      vaOnly,
      trialPhases,
      trialTypes,
      drugs,
      treatments,
      trialId,
      investigator,
      leadOrg,
      resultsPage,
    } = formStore;
  
    let searchValues = {};
  
    if (cancerType.codes.length > 0) {
      searchValues.t = cancerType.codes[0];
    }
    if (age !== '') {
      searchValues.a = age;
    }
    if (keywordPhrases !== '') {
      searchValues.q = keywordPhrases;
    }
    if (zip !== '') {
      searchValues.z = zip;
    }
  
    if (formType === 'basic') {
      // form type param
      searchValues.rl = 1;
      return searchValues;
    } else {
      searchValues.rl = 2;
  
      if (subtypes.length > 0) {
        searchValues.st = [...new Set(subtypes.map(item => item.codes[0]))];
      }
      if (stages.length > 0) {
        searchValues.stg = [...new Set(stages.map(item => item.codes[0]))];
      }
      if (findings.length > 0) {
        searchValues.fin = [...new Set(findings.map(item => item.codes[0]))];
      }
      if (nihOnly) {
        searchValues.nih = 1;
      }
      if (vaOnly) {
        searchValues.va = 1;
      }
      switch (location) {
        case 'search-location-zip':
          searchValues.loc = 1;
          searchValues.z = zip;
          searchValues.zp = zipRadius;
          break;
        case 'search-location-country':
          searchValues.loc = 2;
          searchValues.lcnty = country;
          searchValues.lcty = hospital.term;
          if (country === 'United States') {
            searchValues.lst = [...new Set(states.map(item => item.abbr))];
          }
          break;
        case 'search-location-hospital':
          searchValues.loc = 3;
          searchValues.hos = hospital.term;
          break;
        case 'search-location-nih':
          searchValues.loc = 4;
          break;
        case 'search-location-all':
        default:
          searchValues.loc = 0;
      }
  
      let types = trialTypes.filter(item => item.checked);
      if (types.length > 0) {
        searchValues.tt = [...new Set(types.map(item => item.value))];
      }
  
      let phases = trialPhases.filter(item => item.checked);
      if (phases.length > 0) {
        searchValues.tp = [...new Set(phases.map(item => item.value))];
      }
  
      if (country !== 'United States') {
        searchValues.lcty = city;
      }
      if (states.length > 0) {
        searchValues.lst = [...new Set(states.map(item => item.abbr))];
      }
      if (city !== '') {
        searchValues.lcty = city;
      }
      if (healthyVolunteers) {
        searchValues.hv = 1;
      }
  
      if (drugs.length > 0) {
        searchValues.d = [...new Set(drugs.map(item => item.codes[0]))];
      }
      if (treatments > 0) {
        searchValues.i = [...new Set(treatments.map(item => item.codes[0]))];
      }
      if (trialId !== '') {
        searchValues.tid = trialId;
      }
      if (investigator.term !== '') {
        searchValues.in = investigator.term;
      }
      if (leadOrg.term !== '') {
        searchValues.lo = leadOrg.term;
      }
      if (resultsPage > 1) {
        searchValues.pn = resultsPage;
      }
  
      return searchValues;
    }
  };