import Immutable from "immutable";

let keyValueMap = new Immutable.Map({
	key: "",
	value: ""
});

export default new Immutable.Map({
	author: keyValueMap,
	date: "",
	documentType: "",
	firstEditor: keyValueMap,
	genre: "",
	language: keyValueMap,
	links: new Immutable.List(),
	notes: "",
	publishLocation: keyValueMap,
	reference: "",
	title: ""
});