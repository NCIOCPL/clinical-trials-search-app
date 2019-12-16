export function getAllFormsOnPage() {
    return Array.from(document.forms);
};

export function getAllTrackedFormsOnPage() {
    const allFormsOnPage = getAllFormsOnPage();
    const allTrackedFormsOnPage = allFormsOnPage.length > 0
        ? allFormsOnPage.filter( form => form.getAttribute('data-tracked') === 'tracked' )
        : [];
    console.log('getAllTrackedFormsOnPage:', allTrackedFormsOnPage, allFormsOnPage.length, allFormsOnPage[0].getAttribute('data-tracked'), allFormsOnPage[0], allFormsOnPage);
    return allFormsOnPage;
};

export function getErrorMessage(form) {
    const field = form.getElementsByClassName('cts-input__error-message');
    const fieldArray = field.length > 0 ? field.item(0) : [];
    const getArray = (collection) => {
        return Array.from(collection);
    };
    for (const c of getArray(field)) {
        console.log('getErrorMessage - innards:', c);
    }
    console.log('getErrorMessage:', field, field.innerText, field.textContent);



}

export function serializeFormTrackingData( event, hasError, error ) {
    const { target } = event;
    const { form, id, value } = target;
    const formName = form && form.id ? form.id : null;
    const trackingData = {
        errorMessage: error,
        formName,
        hasError,
        id,
        value
    };
    return trackingData;
}