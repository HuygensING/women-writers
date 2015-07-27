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
	education: keyValueMap,
	financials: keyValueMap,
	gender: "",
	languages: emptyList,
	maritalStatus: keyValueMap,
	names: emptyList,
	persontype: "",
	profession: keyValueMap,
	pseudonyms: emptyList,
	religion: keyValueMap,
	socialClass: keyValueMap
});