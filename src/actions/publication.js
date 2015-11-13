import config from "../config";
import {parseOutgoingPublication} from "../stores/parsers/publication";

import {toggleEdit, changeRoute} from "./router";
import {fetch, save, remove, saveRelations} from "./utils";


export function refreshPublication(id) {
	return function (dispatch) {
		dispatch({type: "REQUEST_PUBLICATION"});

		fetch(`${config.publicationUrl}/${id}`, (response) =>
			dispatch({
				type: "RECEIVE_PUBLICATION",
				response: response
			})
		);
	};
}

export function fetchPublication(id) {
	return function (dispatch, getState) {
		let publications = getState().publications;

		if (publications.current != null && publications.current._id === id) {
			return;
		}

		if (publications.cached[id]) {
			dispatch({
				type: "SET_CURRENT_PUBLICATION",
				current: publications.cached[id]
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
		let saveCallback = function() {
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
		if (publication._id != null) {
			let unchangedPublication = getState().publications.unchanged;

			if (unchangedPublication === null) {
				throw new Error("unchangedPublication is not set");
			}

			let currentRelations = publication["@relations"];
			let prevRelations = unchangedPublication["@relations"];
			let prevRemovedRelations = unchangedPublication["@removedRelations"];
			saveRelations(
				currentRelations,
				prevRelations,
				prevRemovedRelations,
				getState().relations.all,
				publication._id,
				getState().user.token,
				saveCallback
			);
		} else {
			saveCallback();
		}

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
		let {name, values, lowerLimit, upperLimit} = facetValue;
		let newName = name === "dynamic_s_language" ? name : name.replace(/(dynamic_[a-z]+_)(.*)$/, "$1author_$2");
		if (values) {
			newQuery.facetValues.push({name: newName, values: values});
		} else if(lowerLimit && upperLimit) {
			newQuery.facetValues.push({name: newName, lowerLimit: lowerLimit, upperLimit: upperLimit});
		}
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

export function setPublicationResultIds(results) {
	return {
		type: "SET_PUBLICATION_RESULT_IDS",
		ids: results.refs.map((ref) => ref.id),
		_next: results._next || null
	};
}

export function requestNextPublicationResults(url, onNavigate) {
	return function(dispatch) {
		fetch(url, (results) => {
			dispatch({
				type: "APPEND_PUBLICATION_RESULT_IDS",
				ids: results.refs.map((ref) => ref.id),
				_next: results._next || null
			});
			onNavigate("/documents/" + results.refs[0].id);
		});
	};
}

export function selectPublicationVariation(type, id) {

	return function(dispatch) {
		dispatch({type: "SELECT_PUBLICATION_VARIATION_TYPE", variationType: type});
		if(id) {
			let url = config.baseUrl + "/domain/" + type + "s/" + id;
			fetch(url, (results) => {
				dispatch({type: "RECEIVE_PUBLICATION_VARIATION_DATA", data: results});
			});
		} else {
			dispatch({type: "RECEIVE_PUBLICATION_VARIATION_DATA", data: null});
		}
	};
}

export function checkForStoredPublicationSearch() {
	return function (dispatch, getState) {
		let storedSearchQuery = getState().publications.storedSearchQuery;
		if(storedSearchQuery) {
			dispatch({type: "SET_PUBLICATION_QUERY", query: storedSearchQuery});
			dispatch(changeRoute("searchPublications"));
		}
	};
}