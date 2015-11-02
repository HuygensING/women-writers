import Immutable from "immutable";
import {parseIncomingPublication} from "../stores/parsers/publication";
import {unsetFacetValue} from "./utils";
import cloneDeep from "lodash.clonedeep";

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
	unchanged: null,
	requesting: false,
	query: {
		term: "",
		facetValues: []
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
		case "REQUEST_PUBLICATION":
			return {...state, ...{requesting: true}};

		case "RECEIVE_PUBLICATION":
			let parsedPublication = parseIncomingPublication(action.response);

			return {...state, ...{
				all: [...state.all, parsedPublication],
				current: parsedPublication,
				unchanged: cloneDeep(parsedPublication),
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

		case "ROLLBACK_PUBLICATION":
			return {...state, ...{
				current: state.unchanged
			}};

		case "SET_PUBLICATION_QUERY":
			return {...state, ...{
				query: {...action.query, term: ""}
			}};

		case "UNSET_PUBLICATION_FACET_VALUE":
			return {...state,
				query: {...state.query, facetValues: unsetFacetValue(state.query.facetValues, action.field, action.value) }
			};

		case "UNSET_PUBLICATION_FULLTEXT_FIELD":
			return {...state,
				query: {...state.query, fullTextSearchParameters: state.query.fullTextSearchParameters.filter((param) => param.name !== action.field) }
			};

		case "SET_PUBLICATION_FACETS":
			return {...state, ...{
				activeFacets: action.activeFacets
			}};
		default:
			return state;

		case "SET_PUBLICATION_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: action.ids,
					_next: action._next
				}
			}};

		case "APPEND_PUBLICATION_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: [...state.results.ids, ...action.ids],
					_next: action._next
				}
			}};

	}
}