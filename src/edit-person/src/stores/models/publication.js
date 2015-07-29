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
		documentType: emptyList,
		firstEditor: emptyList,
		isCreatedBy: emptyList,
		hasPublishLocation: emptyList,
		hasGenre: emptyList,
		hasWorkLanguage: emptyList
	}),
	tempCreator: "",
	tempLanguage: "",
	tempOrigin: "",
	title: ""
});



