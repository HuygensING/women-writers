export const parseOutgoingGraph = function(data) {
	for(let i in data.links) {
		data.links[i].source = data.nodes[data.links[i].source];
		data.links[i].target = data.nodes[data.links[i].target];
	}
	return data;
};