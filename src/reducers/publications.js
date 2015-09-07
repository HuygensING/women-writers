import {parseIncomingPublication} from "../stores/parsers/publication";

let initialState = {
	all: [],
	current: null,
	requesting: false
};

export default function(state=initialState, action) {
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

		default:
			return state;
	}
}