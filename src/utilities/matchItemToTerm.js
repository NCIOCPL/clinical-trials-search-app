export function matchItemToTerm(item, value) {
	return item.term.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}

export function sortItems(a, b, value) {
	const aLower = a.term.toLowerCase();
	const bLower = b.term.toLowerCase();
	const valueLower = value.toLowerCase();
	const queryPosA = aLower.indexOf(valueLower);
	const queryPosB = bLower.indexOf(valueLower);
	if (queryPosA !== queryPosB) {
		return queryPosA - queryPosB;
	}
	return aLower < bLower ? -1 : 1;
}
