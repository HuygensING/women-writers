const initialState = {
	id: null,
	collection: null
};

const parseIncomingGraph = (data, currentTypes) => {
	if (!currentTypes) {
		data.relationTypes = data.links.reduce((out, link) => {
			if (out.map((o) => o.name).indexOf(link.type) < 0) {
				out.push({name: link.type, checked: true});
			}
			return out;
		}, []);
	} else {
		data.relationTypes = currentTypes;
	}
	return data;
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "RECEIVE_GRAPH":
			return {
				...state,
				id: action.id,
				collection: action.collection,
				data: parseIncomingGraph(action.response, action.currentTypes)
			};
		case "RECEIVE_GRAPH_TABLE":
			return {
				...state,
				table: {
					id: action.id,
					data: action.response,
					collection: action.collection
				}
			};
		default:
			return state;
	}
}