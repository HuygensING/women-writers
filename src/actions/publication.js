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
			let prevRemovedRelations = unchangedPublication[0]["@removedRelations"];

			console.log("savePublication():currentRelations", currentRelations);
			console.log("savePublication():prevRelations", prevRelations);
			console.log("savePublication():prevRemovedRelations", prevRemovedRelations);
			saveRelations(
				currentRelations,
				prevRelations,
				prevRemovedRelations,
				getState().relations.all,
				publication._id,
				getState().user.token
			);
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

export function rollbackPublication() {
	return {
		type: "ROLLBACK_PUBLICATION"
	};
}

const mapAuthorQueryToPublicationQuery = function(authorQuery) {
	let newQuery = {
		facetValues: []
	};
	for(let facetValue of authorQuery.facetValues) {
		let {name, values} = facetValue;
		let newName = name === "dynamic_s_language" ? name : name.replace(/(dynamic_[a-z]+_)(.*)$/, "$1author_$2");
		newQuery.facetValues.push({name: newName, values: values});
	}
	if(authorQuery.fullTextSearchParameters && authorQuery.fullTextSearchParameters.length) {
		for(let param of authorQuery.fullTextSearchParameters) {
			if(param.name === "dynamic_t_name") {
				newQuery.fullTextSearchParameters = [
					{name: "dynamic_t_author_name", term: param.term}
				];
				break;
			}
		}
	}
	return newQuery;
};

export function setPublicationQueryFromAuthorQuery(authorQuery) {
	return {
		type: "SET_PUBLICATION_QUERY",
		query: mapAuthorQueryToPublicationQuery(authorQuery)
	};
}