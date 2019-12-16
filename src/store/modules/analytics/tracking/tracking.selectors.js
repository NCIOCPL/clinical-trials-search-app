import { createSelector } from 'reselect';

import './tracking.defs';
import {get} from "enzyme/src/configuration";

/**
 * getTrackingData - Simple selector that returns tracking data
 * @param {state} state
 * @returns {tracking}
 */
export const getTrackingData = state => state.tracking;

export const getHasDispatchedFormInteractionEvent = createSelector(
    getTrackingData,
    trackingData => trackingData.hasDispatchedFormInteractionEvent
);

export const getHasUserInteractedWithForm = createSelector(
    getTrackingData,
    trackingData => trackingData.hasUserInteractedWithForm
);

/**
 * getFormTrackingData - Simple selector to return forms array from tracking object
 * @param {tracking} getTrackingData
 * @returns {forms}
 */
export const getFormTrackingData = createSelector(
    getTrackingData,
    trackingData => trackingData.forms
);

export const getFocusedForm = createSelector(
    getHasUserInteractedWithForm,
    getFormTrackingData,
    ( hasUserInteractedWithForm, formTrackingData ) => {
        const focusedForm = hasUserInteractedWithForm
            ?  formTrackingData.filter( form => form.isFocused )
            :  [];
        console.log('getFocusedForm:', focusedForm, formTrackingData, formTrackingData.filter( form => form.isFocused ));
        return focusedForm;
    }
);

export const getFocusedField = createSelector(
    getFocusedForm,
    focusedForm => {
        const focusedField = focusedForm.length > 0
            ? focusedForm[0].fields.length > 0 && focusedForm[0].fields.filter( field => field.isFocused )[0]
            : {};
        console.log('getFocusedField:', focusedField, focusedForm);
        return focusedField;
    }
);

export const getIsFormPristine = createSelector(
    getFormTrackingData,
    formTrackingData => {
        return formTrackingData.some( form => form.isFocused && !form.isPristine )
    }
);