import Immutable from "immutable";

let keyValueMap = new Immutable.Map({
	key: "",
	value: ""
});

let emptyList = new Immutable.List();

export default new Immutable.Map({
	birthDate: "",
	birthPlace: "",
	deathDate: "",
	deathPlace: "",
	gender: "",
	names: emptyList,
	persontype: "",
	pseudonyms: emptyList,
	"@relations": new Immutable.Map({
		education: keyValueMap,
		financials: keyValueMap,
		maritalStatus: keyValueMap,
		profession: keyValueMap,
		religion: keyValueMap,
		socialClass: keyValueMap
	})
});