import Immutable from "immutable";

export default new Immutable.Map({
	birthDate: "",
	birthPlace: "",
	deathDate: "",
	deathPlace: "",
	gender: "",
	languages: new Immutable.List(),
	names: new Immutable.List(),
	persontype: "",
	pseudonyms: new Immutable.List()
});