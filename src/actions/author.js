import config from "../config";
import {parseOutgoingAuthor} from "../stores/parsers/author";

import {fetch, save, remove, saveRelations} from "./utils";
import {changeRoute, toggleEdit} from "./router";


export function refreshAuthor(id) {
	return function (dispatch) {
		dispatch({type: "REQUEST_AUTHOR"});

		fetch(`${config.authorUrl}/${id}`, (response) =>
			dispatch({
				type: "RECEIVE_AUTHOR",
				response: response
			})
		);
	};
}

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
				current: found[found.length - 1]
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
			let unchangedAuthor = getState().authors.unchanged;

			if (unchangedAuthor === null) {
				throw new Error("unchangedAuthor not set.");
			}

			let currentRelations = author["@relations"];
			let prevRelations = unchangedAuthor["@relations"];
			let prevRemovedRelations = unchangedAuthor["@removedRelations"];

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


export function rollbackAuthor() {
	return {
		type: "ROLLBACK_AUTHOR"
	};
}


const mapPublicationQueryToAuthorQuery = function(publicationQuery) {
	let newQuery = {
		facetValues: [],
		fullTextSearchParameters: []
	};
	for(let facetValue of publicationQuery.facetValues) {
		let {name, values, upperLimit, lowerLimit} = facetValue;
		if(name === "dynamic_s_language") {
			newQuery.facetValues.push({name: name, values: values});
		} else if(name.match(/_author_/)) {
			if(values) {
				newQuery.facetValues.push({name: name.replace("_author_", "_"), values: values});
			} else if(upperLimit && lowerLimit) {
				newQuery.facetValues.push({name: name.replace("_author_", "_"), upperLimit: upperLimit, lowerLimit: lowerLimit});
			}
		}
	}
	if(publicationQuery.fullTextSearchParameters && publicationQuery.fullTextSearchParameters.length) {
		for(let param of publicationQuery.fullTextSearchParameters) {
			if(param.name === "dynamic_t_author_name") {
				newQuery.fullTextSearchParameters = [
					{name: "dynamic_t_name", term: param.term}
				];
				break;
			}
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

export function setAuthorResultIds(results) {
	return {
		type: "SET_AUTHOR_RESULT_IDS",
		ids: results.refs.map((ref) => ref.id),
		_next: results._next || null
	};
}

export function requestNextAuthorResults(url, onNavigate) {
	return function(dispatch) {
		fetch(url, (results) => {
			dispatch({
				type: "APPEND_AUTHOR_RESULT_IDS",
				ids: results.refs.map((ref) => ref.id),
				_next: results._next || null
			});
			onNavigate("/persons/" + results.refs[0].id);
		});
	};
}