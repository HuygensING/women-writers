import config from "../config";
import {parseOutgoingAuthor} from "../stores/parsers/author";

import {fetch, save, remove, saveRelations} from "./utils";
import {changeRoute, toggleEdit} from "./router";

export function fetchAuthor(id) {
	return function (dispatch, getState) {
		let authors = getState().authors;

		if (authors.current != null && authors.current._id === id) {
			return;
		}

		let found = authors.all.filter((author) =>
			author._id === id);

		if (found.length) {
			dispatch({
				type: "SET_CURRENT_AUTHOR",
				current: found[0]
			});
		} else {
			dispatch({type: "REQUEST_AUTHOR"});

			fetch(`${config.authorUrl}/${id}`, (response) =>
				dispatch({
					type: "RECEIVE_AUTHOR",
					response: response
				})
			);
		}
	};
}

export function saveAuthor() {
	return function (dispatch, getState) {
		let author = getState().authors.current;

		if (author._id != null) {
			let unchangedAuthor = getState().authors.all
				.filter((x) => x._id === author._id);

			if (!unchangedAuthor.length) {
				throw new Error(`Author ${author._id} not found in authors state.`);
			}

			let currentRelations = author["@relations"];
			let prevRelations = unchangedAuthor[0]["@relations"];
			let prevRemovedRelations = unchangedAuthor[0]["@removedRelations"];

			console.log("saveAuthor():currentRelations", currentRelations);
			console.log("saveAuthor():prevRelations", prevRelations);
			console.log("saveAuthor():prevRemovedRelations", prevRemovedRelations);

			saveRelations(
				currentRelations,
				prevRelations,
				prevRemovedRelations,
				getState().relations.all,
				author._id,
				getState().user.token
			);
		}

		save(
			config.authorUrl,
			parseOutgoingAuthor(author),
			getState().user.token,
			(response) => {
				dispatch({
					type: "RECEIVE_AUTHOR",
					response: response
				});

				dispatch(changeRoute("author", [response._id]));
				dispatch(toggleEdit(false));
			}
		);
	};
}

export function deleteAuthor() {
	return function (dispatch, getState) {
		let id = getState().authors.current._id;

		remove(
			`${config.authorUrl}/${id}`,
			getState().user.token,
			() => {
				dispatch({
					type: "AUTHOR_DELETED",
					id: id
				});

				dispatch(changeRoute("searchAuthors"));
				dispatch(toggleEdit(false));
			}
		);
	};
}

export function setAuthorKey(key, value) {
	return {
		type: "SET_AUTHOR_KEY",
		key: key,
		value: value
	};
}

export function deleteAuthorKey(key) {
	return {
		type: "DELETE_AUTHOR_KEY",
		key: key
	};
}

export function newAuthor() {
	return {
		type: "NEW_AUTHOR"
	};
}

const mapPublicationQueryToAuthorQuery = function(publicationQuery) {
	let newQuery = {
		facetValues: []
	};
	for(let facetValue of publicationQuery.facetValues) {
		let {name, values} = facetValue;
		if(name === "dynamic_s_language") {
			newQuery.facetValues.push({name: name, values: values});
		} else if(name.match(/_author_/)) {
			newQuery.facetValues.push({name: name.replace("_author_", "_"), values: values});
		}
	}
	return newQuery;
};

export function setAuthorQueryFromPublicationQuery(publicationQuery) {
	return {
		type: "SET_AUTHOR_QUERY",
		query: mapPublicationQueryToAuthorQuery(publicationQuery)
	};
}