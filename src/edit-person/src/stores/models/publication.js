import Immutable from "immutable";

let keyValueMap = new Immutable.Map({
	key: "",
	value: ""
});

let emptyList = new Immutable.List();

export default new Immutable.Map({
	date: "",
	links: emptyList,
	notes: "",
	reference: "",
	"@relations": new Immutable.Map({
		author: keyValueMap,
		documentType: keyValueMap,
		firstEditor: keyValueMap,
		genre: keyValueMap,
		language: keyValueMap,
		publishLocation: keyValueMap
	}),
	title: ""
});