import { FieldTrackingObject } from './objects/field.object';
import { FormTrackingObject } from './objects/form.object';
import {
    ADD_FORM_TO_TRACKING,
    DISPATCHED_FORM_INTERACTION_EVENT,
    TRACK_FORM_INPUT_CHANGE
} from './tracking.actions';
import './tracking.defs';
import { getAllTrackedFormsOnPage } from '../../../../utilities/forms';

const defaultState = {
    forms: [],
    hasDispatchedFormInteractionEvent: false,
    hasUserInteractedWithForm: false
};

/**
 * Tracking reducer
 * @param {tracking} state
 * @param action
 * @returns {tracking}
 */
const tracking = (
    state = defaultState,
    action
) => {
    const { payload, type } = action;
    switch (type) {
        case ADD_FORM_TO_TRACKING: {
            const { formType } = payload;
            const allTrackedForms = getAllTrackedFormsOnPage();
            console.log(`${type} called from tracking reducer:`, payload, allTrackedForms[0].className, allTrackedForms);

            const trackedForms = allTrackedForms.map( trackedForm => {
                const form = new FormTrackingObject().get();
                form.formType = trackedForm.className.indexOf(formType) !== -1 ? formType : null;
                form.name = trackedForm.id;
                return form;
            });

            return {
                ...state,
                forms: trackedForms
            };
        }
        case DISPATCHED_FORM_INTERACTION_EVENT: {
            console.log(`${type} called from tracking reducer:`, payload);
            return {
                ...state,
                hasDispatchedFormInteractionEvent: payload
            }
        }
        case TRACK_FORM_INPUT_CHANGE: {
            const {
                errorMessage,
                formName,
                hasError,
                id,
                value
            } = payload;
            const { forms } = state;
            // console.log(`${type} called from tracking reducer:`, forms);
            // Check if current element has a parent form in store
            const hasParentForm = forms.some( form => form.name === formName );

            if ( !hasParentForm ) {
                console.log(
                    `Could not find matching parent form for ${id} while running ${type} action.\n 
                    This element would not be tracked! Wrap element in a form tag and add \n
                    "data-tracked" attribute with value "tracked" in order to track.`
                );
                return state;
            }

            const parentForm = forms.map( form => {
                // Reset all values to false
                form.isFocused = false;
                // console.log('parentForm:', form.name, formName, form);
                return form.name === formName ? form : {};
            })[0];

            const hasMatchingField = parentForm.fields && parentForm.fields.some( field => field.id === id );
            const fieldCount = hasMatchingField ? parentForm.fields.length : 0;

            console.log(`${type} called from tracking reducer:`, hasMatchingField, fieldCount);

            const trackedField = new FieldTrackingObject().get();
            trackedField.id = id;
            trackedField.isFocused = true;
            trackedField.errorMessage = errorMessage;
            trackedField.hasError = hasError;
            trackedField.value = value;

            const fields = hasMatchingField
                ?  parentForm.fields.map( (field, i) => {
                        return field.id === id
                            ? {
                                ...field,
                                errorMessage,
                                hasError,
                                isFocused: field.id === id,
                                value
                            }
                            : {
                                ...field,
                                isFocused: false
                            };
                    })
                : [...parentForm.fields, trackedField];

            const form = {
                ...parentForm,
                isPristine: false,
                isFocused: true,
                fields: fields
            };

            console.log(`${type} called from tracking reducer:`, hasParentForm, formName, parentForm, payload, fields, form);
            return {
                ...state,
                hasUserInteractedWithForm: true,
                forms: [ form ]
            };
        }
        default:
            return state;
    }
};

export default tracking;