import setIn from "../util/set-in";

const initialState = {
	log: []
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "SUCCESS_MESSAGE":
			state.log.push({message: action.message, type: action.type, ts: action.ts});
			return state;
		case "ERROR_MESSAGE":
			state.log.push({message: action.message, type: action.type, ts: action.ts});
			return state;
		case "DISMISS_MESSAGE":
			return {
				...state,
				log: setIn([action.messageIndex, "dismissed"], true, state.log)
			};
		case "DISMISS_MESSAGE_BY_TIMESTAMP":
			const foundIdx = state.log
				.map((entry, idx) => ({ts: entry.ts, idx: idx}))
				.find((entry) => entry.ts === action.ts)
				.idx;
			return {
				...state,
				log: setIn([foundIdx , "dismissed"], true, state.log)
			};
	}

	return state;
}