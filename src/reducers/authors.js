import Immutable from "immutable";
import {parseIncomingAuthor} from "../stores/parsers/author";
import {unsetFacetValue} from "./utils";

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
	requesting: false,
	query: {
		term: "",
		facetValues: []
	},
	activeFacets: []
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

		case "SET_AUTHOR_QUERY":
			return {...state, ...{
				query: {...action.query, term: ""}
			}};

		case "UNSET_AUTHOR_FACET_VALUE":
			return {...state,
				query: {...state.query, facetValues: unsetFacetValue(state.query.facetValues, action.field, action.value) }
			};

		case "UNSET_AUTHOR_FULLTEXT_FIELD":
			console.log("TODO: UNSET_AUTHOR_FULLTEXT_FIELD", action.field);
			return state;

		case "SET_AUTHOR_FACETS":
			return {...state, ...{
				activeFacets: action.activeFacets
			}};

		default:
			return state;
	}
}