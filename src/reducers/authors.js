import Immutable from "immutable";
import {parseIncomingAuthor} from "../stores/parsers/author";

function castArray(arr) {
	return (Array.isArray(arr)) ? arr : [arr];
}

let MODEL = {
	"@relations": {},
	"@type": "wwperson",
	birthDate: "",
	deathDate: "",
	gender: "Unknown",
	links: [],
	names: [],
	types: []
};

let initialState = {
	all: [],
	current: MODEL,
	requesting: false
};

export default function(state=initialState, action) {
	let current, key;

	switch (action.type) {
		case "REQUEST_AUTHOR":
			return {...state, ...{requesting: true}};

		case "RECEIVE_AUTHOR":
			let parsedAuthor = parseIncomingAuthor(action.response);

			return {...state, ...{
				all: [...state.all, parsedAuthor],
				current: parsedAuthor,
				requesting: false
			}};

		case "SET_AUTHOR_KEY":
			current = Immutable.fromJS(state.current);
			key = castArray(action.key);

			return {...state, ...{
				current: current.setIn(key, action.value).toJS()
			}};

		case "SET_CURRENT_AUTHOR":
			return {...state, ...{
				current: action.current
			}};

		case "DELETE_AUTHOR_KEY":
			current = Immutable.fromJS(state.current);
			key = castArray(action.key);

			return {...state, ...{
				current: current.deleteIn(key).toJS()
			}};

		case "AUTHOR_DELETED":
			return {...state, ...{
				all: state.all.filter((author) => author._id !== action.id),
				current: MODEL
			}};

		case "NEW_AUTHOR":
			return {...state, ...{
				current: MODEL
			}};

		default:
			return state;
	}
}