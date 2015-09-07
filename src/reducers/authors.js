import {parseIncomingAuthor} from "../stores/parsers/author";

let initialState = {
	all: [],
	current: null,
	requesting: false
};

export default function(state=initialState, action) {
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

		default:
			return state;
	}
}