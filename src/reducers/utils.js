export function unsetFacetValue(facetValues, field, value) {
	let removeFromFacet = facetValues.filter((facetValue) => facetValue.name === field);
	if (!removeFromFacet.length) { return facetValues; }

	if (removeFromFacet[0].values) {
		let newValues = removeFromFacet[0].values.filter((facetValue) => facetValue !== value);
		return facetValues
			.map((facetValue) => (
				facetValue.name === field) ?
					{name: facetValue.name, values: newValues} : facetValue.values ?
						{name: facetValue.name, values: facetValue.values} :
						{name: facetValue.name, lowerLimit: facetValue.lowerLimit, upperLimit: facetValue.upperLimit}
				)
			.filter((facetValue) => (facetValue.values || [""]).length > 0);
	} else {
		return facetValues
			.filter((facetValue) => field !== facetValue.name);
	}
}