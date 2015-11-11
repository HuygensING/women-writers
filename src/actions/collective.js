import config from "../config";
import {fetch} from "./utils";


export function refreshCollective(id) {
	return function (dispatch) {
		dispatch({type: "REQUEST_COLLECTIVE"});

		fetch(`${config.collectiveUrl}/${id}`, (response) =>
			dispatch({
				type: "RECEIVE_COLLECTIVE",
				response: response
			})
		);
	};
}

export function fetchCollective(id) {
	return function (dispatch, getState) {
		let collectives = getState().collectives;
		if (collectives.current != null && collectives.current._id === id) {
			return;
		}

		if (collectives.cached[id]) {
			dispatch({
				type: "SET_CURRENT_COLLECTIVE",
				current: collectives.cached[id]
			});
		} else {
			dispatch({type: "REQUEST_COLLECTIVE"});
			fetch(`${config.collectiveUrl}/${id}`, (response) =>
				dispatch({
					type: "RECEIVE_COLLECTIVE",
					response: response
				})
			);
		}
	};
}


export function setCollectiveResultIds(results) {
	return {
		type: "SET_COLLECTIVE_RESULT_IDS",
		ids: results.refs.map((ref) => ref.id),
		_next: results._next || null
	};
}

export function requestNextCollectiveResults(url, onNavigate) {
	return function(dispatch) {
		fetch(url, (results) => {
			dispatch({
				type: "APPEND_COLLECTIVE_RESULT_IDS",
				ids: results.refs.map((ref) => ref.id),
				_next: results._next || null
			});
			onNavigate("/collectives/" + results.refs[0].id);
		});
	};
}