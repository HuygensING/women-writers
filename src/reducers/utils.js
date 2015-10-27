export function unsetFacetValue(facetValues, field, value) {
	let removeFromFacet = facetValues.filter((facetValue) => facetValue.name === field);
	if (!removeFromFacet.length) { return facetValues; }

	let newValues = removeFromFacet[0].values.filter((facetValue) => facetValue !== value);
	return facetValues
		.map((facetValue) => (facetValue.name === field) ? {name: facetValue.name, values: newValues} : {name: facetValue.name, values: facetValue.values})
		.filter((facetValue) => facetValue.values.length > 0);
}