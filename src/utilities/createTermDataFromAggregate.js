/**
 * Creates an array of objects with "term" and "termKey" as object properties
 * populated with value of "key" property from an array of objects provided as parameter
 * @param {array} data - An array containing objects with a "key" property
 * @return {({termKey: *, term: *})[]|*[]}
 */
export const createTermDataFromAggregate = (data = []) => {
	const retArray = data
		.map((dataObj) => {
			const { key } = dataObj;

			// Early exit and return null if key is undefined
			if (!key) {
				return null;
			}

			const retObj = { term: key, termKey: key };
			return retObj;
		})
		.filter(Boolean);

	return retArray.length ? retArray : [];
};
