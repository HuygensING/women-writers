import config from "../config";
import {parseOutgoingAuthor} from "../stores/parsers/author";

import {fetch, fetchPost, save, remove, saveRelations} from "./utils";
import {changeRoute, toggleEdit} from "./router";


let cachedGenders = {};

const scrapeGenders = (relatedTo, dispatch) => {
	if(!relatedTo) { return; }
	let paths = relatedTo.map((r) => config.baseUrl + "/" + r.path);

	const digestGender = (response) => {
		cachedGenders[response._id] = response.gender;
		dispatch({type: "SET_GENDER_MAP", genderMap: cachedGenders});
	};

	for(let i in paths) {
		if(!cachedGenders[paths[i].replace(/.*\//, "")]) {
			fetch(paths[i], digestGender);
		}
	}
};


let publicationPropsCacheForAuthor = {};

const scrapePublicationProps = (author, getState, dispatch) => {
	if(!author["@relations"].isCreatorOf) { return; }
	if(publicationPropsCacheForAuthor[author._id]) {
		dispatch({
			type: "SET_AUTHOR_PUBLICATION_RECEPTION_PROPS",
			props: publicationPropsCacheForAuthor[author._id],
			authorId: author._id
		});
		return;
	}
	if(!author.names[0]) { return; }

	if(!getState().publications.initialSearchId) {
		setTimeout(function() {
			scrapePublicationProps(author, getState, dispatch);
		}, 50);
	} else {
		let authorName = author.names[0].components.map((c) => c.value).join(" ");
		let payload = {
			facetValues: [{"name": "dynamic_s_creator", "values": [authorName]}],
			term: "",
			otherSearchId: getState().publications.initialSearchId
		};

		const digestProps = (response) => {
			publicationPropsCacheForAuthor[author._id] = response.refs.map((ref) => {
				return {id: ref.id, receptionTitle: ref.sourceName, sourceId: ref.sourceData._id, targetId: ref.targetData._id};
			});
			dispatch({
				type: "SET_AUTHOR_PUBLICATION_RECEPTION_PROPS",
				props: publicationPropsCacheForAuthor[author._id],
				authorId: author._id
			});
			return;
		};


		const fetchProps = (url) => {
			fetch(url, digestProps);
		};

		fetchPost(config.baseUrl + "/search/wwrelations/wwdocuments", payload, fetchProps);
	}
};

export function refreshAuthor(id) {
	return function (dispatch) {
		dispatch({type: "REQUEST_AUTHOR"});

		fetch(`${config.authorUrl}/${id}`, (response) => {
			scrapeGenders(response["@relations"].isRelatedTo, dispatch);
			dispatch({
				type: "RECEIVE_AUTHOR",
				response: response
			});
		});
	};
}

export function fetchAuthor(id) {
	return function (dispatch, getState) {
		let authors = getState().authors;

		if (authors.current != null && authors.current._id === id) {
			return;
		}

		if (authors.cached[id]) {
			dispatch({
				type: "SET_CURRENT_AUTHOR",
				current: authors.cached[id]
			});
		} else {
			dispatch({type: "REQUEST_AUTHOR"});

			fetch(`${config.authorUrl}/${id}`, (response) => {
				scrapeGenders(response["@relations"].isRelatedTo, dispatch);
				scrapePublicationProps(response, getState, dispatch);
				dispatch({
					type: "RECEIVE_AUTHOR",
					response: response
				});
			});
		}
	};
}

export function saveAuthor() {
	return function (dispatch, getState) {
		let author = getState().authors.current;
		let saveCallback = function() {
			save(
				config.authorUrl,
				parseOutgoingAuthor(author),
				getState().user.token,
				(response) => {
					scrapeGenders(response["@relations"].isRelatedTo, dispatch);

					dispatch({
						type: "RECEIVE_AUTHOR",
						response: response
					});

					dispatch(changeRoute("author", [response._id]));
					dispatch(toggleEdit(false));
				}
			);
		};

		if (author._id != null) {
			let unchangedAuthor = getState().authors.unchanged;

			if (unchangedAuthor === null) {
				throw new Error("unchangedAuthor not set.");
			}

			let currentRelations = author["@relations"];
			let prevRelations = unchangedAuthor["@relations"];
			let prevRemovedRelations = unchangedAuthor["@removedRelations"];

			saveRelations(
				currentRelations,
				prevRelations,
				prevRemovedRelations,
				getState().relations.all,
				author._id,
				getState().user.token,
				saveCallback
			);
		} else {
			saveCallback();
		}


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

export function selectAuthorVariation(type, id) {

	return function(dispatch) {
		dispatch({type: "SELECT_AUTHOR_VARIATION_TYPE", variationType: type});
		if(id) {
			let url = config.baseUrl + "/domain/" + type + "s/" + id;
			fetch(url, (results) => {
				dispatch({type: "RECEIVE_AUTHOR_VARIATION_DATA", data: results});
			});
		} else {
			dispatch({type: "RECEIVE_AUTHOR_VARIATION_DATA", data: null});
		}
	};
}

export function checkForStoredAuthorSearch() {
	return function (dispatch, getState) {
		let storedSearchQuery = getState().authors.storedSearchQuery;
		let storedReceptionQuery = getState().receptions.storedSearchQuery;
		if(storedSearchQuery) {
			dispatch({type: "SET_AUTHOR_QUERY", query: storedSearchQuery});
			dispatch(changeRoute("searchAuthors"));
		} else if(storedReceptionQuery && storedReceptionQuery.type === "authors") {
			dispatch({type: "SET_AUTHOR_QUERY", query: storedReceptionQuery.query.authors});
			dispatch({type: "UPDATE_RECEPTION_STORED_QUERY", query: storedReceptionQuery});
			dispatch(changeRoute("receptions", ["authors"]));
		}
	};
}