const lPad = (i) => ("" + i).length === 1 ? "0" + i : "" + i;

export function makeDate(d) {
	return parseInt(d.getFullYear() + lPad(d.getMonth() + 1) + "" + lPad(d.getDate()));
}

export function makeLabel(value) {
	return ("" + value).substr(6, 2) + "-" +
		("" + value).substr(4, 2) + "-" +
		("" + value).substr(0, 4);
}