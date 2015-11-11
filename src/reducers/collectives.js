import Immutable from "immutable";
import cloneDeep from "lodash.clonedeep";

function castArray(arr) {
	return (Array.isArray(arr)) ? arr : [arr];
}


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

		case "ROLLBACK_COLLECTIVE":
			return {...state, ...{
				current: state.unchanged
			}};

		case "COLLECTIVE_DELETED":
			let c = state.cached;
			delete c[action.id];
			return {...state, ...{
				cached: c,
				current: null
			}};

		case "SET_COLLECTIVE_KEY":
			let current = Immutable.fromJS(state.current);
			let key = castArray(action.key);

			return {...state, ...{
				current: current.setIn(key, action.value).toJS()
			}};

		case "NEW_COLLECTIVE":
			return {...state, ...{
				current: {name: "", type: "", links: [], "@relations": {}, "@type": "wwcollective"}
			}};

		default:
			return state;
	}
}