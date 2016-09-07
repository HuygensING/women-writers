import config from "../config";
import server from "./server";

import authorReceptionDefinitions from "../definitions/author-receptions";
import publicationReceptionDefinitions from "../definitions/publication-receptions";

const allTypes = authorReceptionDefinitions.outBound.concat(publicationReceptionDefinitions.outBound).concat("isCreatedBy");



const fetchGraphTable = (collection, id, dispatch) => {
	server.fastXhr(`${config.apiUrl["v2.1"]}/domain/ww${collection}/${id}`, (err, resp, body) => {
			dispatch({
				type: "RECEIVE_GRAPH_TABLE",
				response: JSON.parse(body),
				id: id,
				collection: collection
			});
	});
};


const parseIncomingGraph = function(data) {
	for(let i in data.links) {
		data.links[i].source = data.nodes[data.links[i].source];
		data.links[i].target = data.nodes[data.links[i].target];
	}
	return data;
};

const fetchGraph = (collection, id, requestedTypes = null) => (dispatch) => {
	const types = requestedTypes ?
		requestedTypes.filter((type) => type.checked).map((type) => type.name)
		: allTypes;

	server.fastXhr(`${config.graphUrl}/ww${collection}/${id}?depth=2&types=${types.join("&types=")}`, (err, resp, body) =>
		dispatch({
			type: "RECEIVE_GRAPH",
			response: parseIncomingGraph(JSON.parse(body)),
			collection: collection,
			id: id,
			currentTypes: requestedTypes
		})
	);
	fetchGraphTable(collection, id, dispatch);
};

export { fetchGraph, fetchGraphTable }