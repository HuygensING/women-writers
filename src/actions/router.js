import {fetchAuthor, newAuthor} from "./author";
import {fetchPublication, newPublication} from "./publication";

export function changeRoute(handler, props=[]) {
	return function (dispatch, getState) {
		let hasAuthorHandler = (handler === "author" || handler === "editAuthor");
		let hasPublicationHandler = (handler === "publication" || handler === "editPublication");
		let hasId = props[0] != null && props[0] != "new";

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