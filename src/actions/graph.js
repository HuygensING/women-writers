import config from "../config";
import {fetch} from "./utils";
import {parseOutgoingGraph} from "../stores/parsers/graph";


export function fetchGraph(domain, id) {
	return function (dispatch, getState) {

		let found = getState().graphs.all.filter((graph) => graph.id === `${domain}/${id}`);

		if (found.length) {
			dispatch({
				type: "SET_CURRENT_GRAPH",
				current: found[0]
			});
		} else {
			dispatch({type: "REQUEST_GRAPH"});
			fetch(`${config.graphUrl}/${domain}/${id}?depth=1`, (response) =>
				dispatch({
					type: "RECEIVE_GRAPH",
					response: parseOutgoingGraph(response),
					id: `${domain}/${id}`
				})
			);
		}
	};
}