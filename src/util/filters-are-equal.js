const valueIsPresentIn = (current, other) => other
	.filter((val) => val === current)
	.length > 0;


const valuesAreEqual = (valA, valB) => {
	if (valA === valB) { return true; }
	if (typeof valA === "string" && typeof valB === "string") { return false; }
	if (valA.length !== valB.length) { return false; }

	for (let i = 0; i < valA.length; i++) {
		if (!valueIsPresentIn(valA[i], valB)) {
			return false;
		}
	}

	return true;
};

const filterIsPresentIn = (current, other) => other
	.filter((filter) => (
		filter.field === current.field &&
		filter.type === current.type &&
		valuesAreEqual(filter.value, current.value)
	)).length > 0;


export default (a, b) => {
	if (a.length !== b.length) { return false; }

	for (let i = 0; i < a.length; i++) {
		if (!filterIsPresentIn(a[i], b)) {
			return false;
		}
	}
	return true;
};

