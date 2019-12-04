import {ACTIVE_TRIAL_STATUSES} from '../constants'

/**
 * Fetch a list of interventions from the API matching the intervention ids
 * @param {ClinicalTrialsService} ctsService - service instance
 * @param {array} ids - a list of IDs to fetch.
 */
export const ctsapiInterventionFetcher = async (ctsService, ids) => {
    const matchingInterventions = await ctsService.getInterventions(
        // Don't care about the category
        null,
        // Don't care about matching a name
        null,
        // Max out the size
        100,
        // Add the additional params.
        {
            //The IDs to fetch.
            code: ids,
            //Only check active trials statuses.
            current_trial_status: ACTIVE_TRIAL_STATUSES,
        }
    );

    // Return as list of objects, which is what this code expects.
    // In the future the client should just use an interface instead
    // of creating objects. If an interface was used, it would apply
    // to the object, and we would not need to convert here.
    return matchingInterventions.terms.map(intervention => ({
        name: intervention.name,
        codes: intervention.codes,
        synonyms: intervention.synonyms,
        category: intervention.category,
        type: intervention.type
    }));
}