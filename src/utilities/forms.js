/**
 * getAllFormsOnPage - Returns an array of all forms on page
 * @returns {HTMLFormElement[]}
 */
export function getAllFormsOnPage() {
    return Array.from(document.forms);
};

/**
 * getAllTrackedFormsOnPage - Returns an array of all tracked forms on page
 * (forms have to have a 'data-tracked' attribute with value set to 'tracked')
 * @returns {HTMLFormElement[]}
 */
export function getAllTrackedFormsOnPage() {
    const allFormsOnPage = getAllFormsOnPage();
    const allTrackedFormsOnPage = allFormsOnPage.length > 0
        ? allFormsOnPage.filter( form => form.getAttribute('data-tracked') === 'tracked' )
        : [];
    return allFormsOnPage;
};
