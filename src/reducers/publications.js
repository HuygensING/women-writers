import Immutable from "immutable";
import {parseIncomingPublication} from "../stores/parsers/publication";

function castArray(arr) {
	return (Array.isArray(arr)) ? arr : [arr];
}

const MODEL = {
	"@relations": {},
	"@type": "wwdocument",
	date: "",
	documentType: "Unknown",
	links: [],
	notes: "",
	reference: "",
	tempCreator: "",
	tempLanguage: "",
	tempOrigin: "",
	title: ""
};

let initialState = {
	all: [],
	current: MODEL,
	requesting: false,
	query: {
		facetValues: []
	}
};

export default function(state=initialState, action) {
	let current, key;

	switch (action.type) {
		case "REQUEST_PUBLICATION":
			return {...state, ...{requesting: true}};

		case "RECEIVE_PUBLICATION":
			let parsedPublication = parseIncomingPublication(action.response);

			return {...state, ...{
				all: [...state.all, parsedPublication],
				current: parsedPublication,
				requesting: false
			}};

		case "SET_CURRENT_PUBLICATION":
			return {...state, ...{
				current: action.current
			}};

		case "SET_PUBLICATION_KEY":
			current = Immutable.fromJS(state.current);
			key = castArray(action.key);

			return {...state, ...{
				current: current.setIn(key, action.value).toJS()
			}};

		case "DELETE_PUBLICATION_KEY":
			current = Immutable.fromJS(state.current);
			key = castArray(action.key);

			return {...state, ...{
				current: current.deleteIn(key).toJS()
			}};

		case "PUBLICATION_DELETED":
			return {...state, ...{
				all: state.all.filter((author) => author._id !== action.id),
				current: MODEL
			}};

		case "NEW_PUBLICATION":
			return {...state, ...{
				current: MODEL
			}};

		case "SET_PUBLICATION_QUERY":
			return {...state, ...{
				query: action.query
			}};
		default:
			return state;
	}
}