export function matchItemToTerm(item, value) {
	return item.key.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}
