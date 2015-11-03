import Immutable from "immutable";
import {parseIncomingAuthor} from "../stores/parsers/author";
import {unsetFacetValue} from "./utils";
import cloneDeep from "lodash.clonedeep";


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
	cached: {},
	current: MODEL,
	unchanged: null,
	requesting: false,
	showVariation: null,
	query: {
		term: "",
		facetValues: [],
		fullTextSearchParameters: []
	},
	activeFacets: [],
	results: {
		ids: [],
		_next: null
	}
};

export default function(state=initialState, action) {
	let current, key;

	switch (action.type) {
		case "REQUEST_AUTHOR":
			return {...state, ...{requesting: true}};

		case "RECEIVE_AUTHOR":
			let parsedAuthor = parseIncomingAuthor(action.response);
			return {...state, ...{
				cached: {...state.cached, ...{[parsedAuthor._id]: parsedAuthor}},
				current: parsedAuthor,
				unchanged: cloneDeep(parsedAuthor),
				showVariation: null,
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
				current: action.current,
				showVariation: null
			}};

		case "DELETE_AUTHOR_KEY":
			current = Immutable.fromJS(state.current);
			key = castArray(action.key);

			return {...state, ...{
				current: current.deleteIn(key).toJS()
			}};

		case "AUTHOR_DELETED":
			let c = state.cached;
			delete c[action.id];
			return {...state, ...{
				cached: c,
				current: MODEL
			}};

		case "NEW_AUTHOR":
			return {...state, ...{
				current: MODEL
			}};

		case "ROLLBACK_AUTHOR":
			return {...state, ...{
				current: state.unchanged
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
			return {...state,
				query: {...state.query, fullTextSearchParameters: state.query.fullTextSearchParameters.filter((param) => param.name !== action.field) }
			};
		case "SET_AUTHOR_FACETS":
			return {...state, ...{
				activeFacets: action.activeFacets
			}};

		case "SET_AUTHOR_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: action.ids,
					_next: action._next
				}
			}};

		case "APPEND_AUTHOR_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: [...state.results.ids, ...action.ids],
					_next: action._next
				}
			}};

		case "SELECT_AUTHOR_VARIATION":
			return {...state, showVariation: action.variationType};

		default:
			return state;
	}
}