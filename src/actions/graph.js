import config from "../config";
import {fetch} from "./utils";
import {parseIncomingGraph} from "../stores/parsers/graph";

let fetchDomainMetadata = function(domain, id, dispatch) {
	fetch(`${config.domainUrl}/${domain}/${id}`, (response) =>
		dispatch({
			type: "RECEIVE_GRAPH_TABLE",
			response: response,
			id: `${domain}/${id}`
		})
	);
};


export function fetchGraph(domain, id) {
	return function (dispatch, getState) {

		let found = getState().graphs.all.filter((graph) => graph.id === `${domain}/${id}`);

		if (found.length) {
			dispatch({
				type: "SET_CURRENT_GRAPH",
				current: found[0]
			});
		} else {
			fetch(`${config.graphUrl}/${domain}/${id}?depth=1`, (response) =>
				dispatch({
					type: "RECEIVE_GRAPH",
					response: parseIncomingGraph(response),
					id: `${domain}/${id}`
				})
			);
		}
		fetchDomainMetadata(domain, id, dispatch);
	};
}

export function fetchGraphTable(domain, id) {
	return function (dispatch) {
		fetchDomainMetadata(domain, id, dispatch);
	};
}