import displayNameMap from "../stores/utils/relation-display-names";

let hasType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type || relation.targetTypeName === type;
};

let hasBothType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type && relation.targetTypeName === type;
};

let toDisplayName = function(prev, current) {
	prev[current.regularName] = displayNameMap[current.regularName];
	prev[current.inverseName] = displayNameMap[current.inverseName];

	return prev;
};

let initialState = {
	all: [],
	author: [],
	authorPublication: [],
	displayNames: {},
	publication: [],
	publicationPublication: [],
	requesting: false
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "REQUEST_RELATIONS":
			return {...state, ...{requesting: true}};

		case "RECEIVE_RELATIONS":
			let authorRelations = action.response.filter(hasType("person"));
			let publicationRelations = action.response.filter(hasType("document"));
			return {...state, ...{
				all: action.response,
				author: authorRelations,
				authorPublication: authorRelations.filter(hasType("document")),
				displayNames: action.response.reduce(toDisplayName, {}),
				publication: publicationRelations,
				publicationPublication: publicationRelations.filter(hasBothType("document")),
				requesting: false
			}};

		default:
			return state;
	}
}