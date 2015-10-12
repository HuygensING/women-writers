let initialState = {
	all: [],
	current: null,
	table: null,
	requesting: false
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "REQUEST_GRAPH":
			return {...state, ...{current: {data: null}, requesting: true}};
		case "RECEIVE_GRAPH":
			return {...state, ...{
				all: [...state.all, {id: action.id, data: action.response}],
				current: {id: action.id, data: action.response},
				requesting: false
			}};
		case "RECEIVE_GRAPH_TABLE":
			return {...state, ...{
				table: {id: action.id, data: action.response},
				requesting: false
			}};
		case "SET_CURRENT_GRAPH":
			return {...state, ...{
				current: action.current
			}};

		default:
			return state;
	}
}