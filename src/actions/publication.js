import config from "../config";
import {parseOutgoingPublication} from "../stores/parsers/publication";

import {toggleEdit, changeRoute} from "./router";
import {fetch, save, remove, saveRelations} from "./utils";

export function fetchPublication(id) {
	return function (dispatch, getState) {
		let publications = getState().publications;

		if (publications.current != null && publications.current._id === id) {
			return;
		}

		let found = publications.all.filter((publication) =>
			publication._id === id);

		if (found.length) {
			dispatch({
				type: "SET_CURRENT_PUBLICATION",
				current: found[0]
			});
		} else {
			dispatch({type: "REQUEST_PUBLICATION"});

			fetch(`${config.publicationUrl}/${id}`, (response) =>
				dispatch({
					type: "RECEIVE_PUBLICATION",
					response: response
				})
			);
		}
	};
}

export function savePublication() {
	return function (dispatch, getState) {
		let publication = getState().publications.current;

		if (publication._id != null) {
			let unchangedPublication = getState().publications.all
				.filter((x) => x._id === publication._id);

			if (!unchangedPublication.length) {
				throw new Error(`Publication ${publication._id} not found in publications state.`);
			}

			let currentRelations = publication["@relations"];
			let prevRelations = unchangedPublication[0]["@relations"];

			// saveRelations(currentRelations, prevRelations, publication._id);
		}

		save(
			config.publicationUrl,
			parseOutgoingPublication(publication),
			getState().user.token,
			(response) => {
				dispatch({
					type: "RECEIVE_PUBLICATION",
					response: response
				});

				dispatch(changeRoute("publication", [response._id]));
				dispatch(toggleEdit(false));
			}
		);
	};
}

export function deletePublication() {
	return function (dispatch, getState) {
		let id = getState().publications.current._id;

		remove(
			`${config.publicationUrl}/${id}`,
			getState().user.token,
			() => {
				dispatch({
					type: "PUBLICATION_DELETED",
					id: id
				});

				dispatch(changeRoute("searchPublications"));
				dispatch(toggleEdit(false));
			}
		);
	};
}


export function setPublicationKey(key, value) {
	return {
		type: "SET_PUBLICATION_KEY",
		key: key,
		value: value
	};
}

export function deletePublicationKey(key) {
	return {
		type: "DELETE_PUBLICATION_KEY",
		key: key
	};
}

export function newPublication() {
	return {
		type: "NEW_PUBLICATION"
	};
}