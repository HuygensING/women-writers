import Immutable from "immutable";

// let keyValueMap = new Immutable.Map({
// 	key: "",
// 	value: ""
// });

let emptyList = new Immutable.List();

export default new Immutable.Map({
	birthDate: "",
	deathDate: "",
	gender: "",
	names: emptyList,
	persontype: "",
	pseudonyms: emptyList,
	"@relations": new Immutable.Map({
		hasBirthPlace: emptyList,
		hasDeathPlace: emptyList,
		hasEducation: emptyList,
		hasFinancials: emptyList,
		hasMaritalStatus: emptyList,
		hasProfession: emptyList,
		hasPseudonym: emptyList,
		hasReligion: emptyList,
		hasResidenceLocation: emptyList,
		hasSocialClass: emptyList,
		isCollaboratorOf: emptyList,
		isMemberOf: emptyList,
		isSpouseOf: emptyList
	})
});