import cloneDeep from "lodash.clonedeep";

let initialState = {
	cached: {},
	current: null,
	unchanged: null,
	requesting: false,
	results: {
		ids: [],
		_next: null
	}
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "REQUEST_COLLECTIVE":
			return {...state, ...{requesting: true}};

		case "RECEIVE_COLLECTIVE":

			return {...state, ...{
				cached: {...state.cached, ...{[action.response._id]: action.response}},
				current: action.response,
				unchanged: cloneDeep(action.response),
				showVariation: null,
				variationData: null,
				requesting: false
			}};

		case "SET_CURRENT_COLLECTIVE":
			return {...state, ...{
				current: action.current,
				showVariation: null,
				variationData: null
			}};

		case "SET_COLLECTIVE_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: action.ids,
					_next: action._next
				}
			}};

		case "APPEND_COLLECTIVE_RESULT_IDS":
			return {...state, ...{
				results: {
					ids: [...state.results.ids, ...action.ids],
					_next: action._next
				}
			}};

		default:
			return state;
/*
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
			let c = state.cached;
			delete c[action.id];
			return {...state, ...{
				cached: c,
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

		case "SELECT_PUBLICATION_VARIATION_TYPE":
			return {...state, showVariation: action.variationType};

		case "RECEIVE_PUBLICATION_VARIATION_DATA":
			return {...state, variationData: action.data === null ? null : parseIncomingPublication(action.data)};
*/
	}
}