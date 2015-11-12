const lPad = (i) =>	("" + i).length === 1 ? "0" + i : "" + i;

export function makeDate(d) {
	return parseInt(d.getFullYear() + lPad(d.getMonth() + 1) + "" + lPad(d.getDate()));
}
