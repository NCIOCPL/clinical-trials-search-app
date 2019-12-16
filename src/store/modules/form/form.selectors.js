import { createSelector } from 'reselect';

export const getFormData = state => state.form;

/**
 * getHasInvalidAge - Returns boolean flag if an invalid age has been entered in the form
 * @param {state} state
 * @returns {boolean}
 */
export const getHasInvalidAge = createSelector(
    getFormData,
    formData => formData.hasInvalidAge
);

/**
 * getHasInvalidZip - Returns boolean flag if an invalid zip has been entered in the form
 * @param {state} state
 * @returns {boolean}
 */
export const getHasInvalidZip = createSelector(
    getFormData,
    formData => formData.hasInvalidZip
);

/**
 * getFormHasError - Returns boolean flag if an error has occurred om the form
 * @param {state} state
 * @returns {boolean}
 */
export const getFormHasError = createSelector(
    getHasInvalidAge,
    getHasInvalidZip,
    (hasInvalidAge, hasInvalidZip) => hasInvalidAge || hasInvalidZip
);