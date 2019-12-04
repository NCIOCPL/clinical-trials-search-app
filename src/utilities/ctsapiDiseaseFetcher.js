import {ACTIVE_TRIAL_STATUSES} from '../constants'

/**
 * Fetch a list of diseases from the API matching the disease ids
 * @param {ClinicalTrialsService} ctsService - service instance
 * @param {array} ids - a list of IDs to fetch.
 */
export const ctsapiDiseaseFetcher = async (ctsService, ids) => {
    const matchingDiseases = await ctsService.getDiseases(
        // Get all items regardless of type, this must be supplied.
        ['maintype', 'subtype', 'stage', 'finding'],
        // Don't care about ancestors
        [],
        // Add the additional params.
        {
            //The IDs to fetch.
            code: ids,
            //Only check active trials statuses.
            current_trial_status: ACTIVE_TRIAL_STATUSES,
            // Use the max size, although we should not be asking for 100
            // ids
            size:100
        }
    );

    // Return as list of objects, which is what this code expects.
    // In the future the client should just use an interface instead
    // of creating objects.
    return matchingDiseases.terms.map(disease => ({
        name: disease.name,
        codes: disease.codes,
        parent_ids: disease.parentDiseaseID,
        type: disease.type
    }));
}