import {fetchGraph} from "./graph";
import {fetchAuthor, newAuthor} from "./author";
import {fetchPublication, newPublication} from "./publication";

export function changeRoute(handler, props=[]) {
	return function (dispatch) {
		let hasAuthorHandler = (handler === "author" || handler === "editAuthor");
		let hasPublicationHandler = (handler === "publication" || handler === "editPublication");
		let hasGraphHandler = (handler === "graph");

		let hasId = hasGraphHandler ?
			(props[1] != null) :
			(props[0] != null && props[0] !== "new");

		let hasGraphDomain = props[0] != null;

		if (hasGraphHandler && hasGraphDomain && hasId) {
			dispatch(fetchGraph(props[0], props[1]));
		}

		if (hasAuthorHandler && hasId) {
			dispatch(fetchAuthor(props[0]));
		}

		if (hasPublicationHandler && hasId) {
			dispatch(fetchPublication(props[0]));
		}

		if (hasAuthorHandler && !hasId) {
			dispatch(newAuthor());
		}

		if (hasPublicationHandler && !hasId) {
			dispatch(newPublication());
		}

		dispatch({
			type: "CHANGE_ROUTE",
			handler: handler,
			props: props
		});
	};
}

export function toggleEdit(edit) {
	return {
		type: "TOGGLE_EDIT",
		edit: edit
	};
}

export function changeTab(label) {
	return {
		type: "CHANGE_TAB",
		label: label
	};
}