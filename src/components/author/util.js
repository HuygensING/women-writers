export function hasRegularName(regularName, negate = false) {
	return (relation) =>
		(relation.regularName === regularName) !== negate;
}

