let initialState = null;

export default function(state=initialState, action) {
	switch (action.type) {
		case "SERVER_ERROR":
			return action;
		case "CLEAR_SERVER_ERROR":
			return null;
		default:
			return state;
	}
}