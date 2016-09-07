let initialState = {
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "RECEIVE_ENTITY":
			return initialState;
		case "SET_OTHER_DATA":
			return {...action.data};
	}
	return state;
}