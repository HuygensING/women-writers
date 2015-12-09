let initialState = {
	cached: {},
	current: null,
	table: null,
	requesting: false
};

const parseIncomingGraph = (data, cached) => {
	data.relationTypes = data.links.reduce((out, link) => {
		if(out.map((o) => o.name).indexOf(link.type) < 0) { out.push({name: link.type, checked: true}); }
		return out;
	}, []);

	if(cached) {
		for(let i in cached.data.relationTypes) {
			let currentType = cached.data.relationTypes[i];
			if(data.relationTypes.map((rlt) => rlt.name).indexOf(currentType.name) < 0) {
				data.relationTypes.push({
					name: currentType.name,
					checked: false
				});
			}
		}
	}
	return data;
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "REQUEST_GRAPH":
			return {...state, ...{current: {data: null}, requesting: true}};
		case "RECEIVE_GRAPH":
			let data = parseIncomingGraph(action.response, state.cached[action.id]);
			return {...state, ...{
				cached: {...state.cached, ...{[action.id]: {id: action.id, data: data}}},
				current: {id: action.id, data: data},
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