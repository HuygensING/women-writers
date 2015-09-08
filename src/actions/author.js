// import dispatcher from "../dispatcher";
// import API from "../stores/api";

// let authorActions = {
// 	getAuthor(id) {
// 		if (id != null) {
// 			API.getAuthor(id);
// 		} else {
// 			dispatcher.handleViewAction({
// 				actionType: "AUTHOR_NEW"
// 			});
// 		}
// 	},

// 	saveAuthor() {
// 		API.saveAuthor();
// 	},

// 	deleteAuthor() {
// 		API.deleteAuthor();
// 	},

// 	setKey(key, value) {
// 		dispatcher.handleViewAction({
// 			actionType: "AUTHOR_SET_KEY",
// 			key: key,
// 			value: value
// 		});
// 	},

// 	deleteKey(key) {
// 		dispatcher.handleViewAction({
// 			actionType: "AUTHOR_DELETE_KEY",
// 			key: key
// 		});
// 	}
// };

// export default authorActions;


import xhr from "xhr";
import config from "../config";
import saveRelations from "../stores/utils/save-relations";
import {parseOutgoingAuthor} from "../stores/parsers/author";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

let checkForError = function(err, response, body) {
	// switch (response.statusCode) {
	// 	case 401:
	// 		messagesActions.send("Unauthorized");
	// 		return true;

	// 	case 403:
	// 		messagesActions.send("Forbidden");
	// 		return true;

	// 	case 404:
	// 		router.navigate("not-found", {
	// 			trigger: true
	// 		});
	// 		return true;
	// }

	return false;
};

let fetch = function(url, cb) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		cb(JSON.parse(body));
	};

	xhr(options, done);
};

let remove = function(url, token, cb) {
	let options = {
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: token
		}},
		method: "DELETE",
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		cb();
		// if (response.statusCode === 204) {
		// 	router.navigate(`${type}s`, {
		// 		trigger: true
		// 	});
		// }
	};

	xhr(options, done);
};

let save = function(url, model, token, cb) {
	let [method, theUrl] = (model._id == null) ?
		["POST", url] :
		["PUT", url + "/" + model._id];

	let options = {
		body: JSON.stringify(model),
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: token
		}},
		method: method,
		url: theUrl
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		if (body == null && response.headers.location != null) {
			fetch(response.headers.location, cb);
		} else {
			cb(JSON.parse(body));
		}
		// switch (method) {
		// 	case "POST":
		// 		let location = response.headers.location;
		// 		let id = location.substr(location.lastIndexOf("/") + 1);

		// 		router.navigate(`${type}s/${id}`, {
		// 			trigger: true
		// 		});

		// 		break;

		// 	case "PUT":
		// 		body = parseIn(JSON.parse(body));
		// 		action(body);

		// 		router.navigate(`${type}s/${body._id}`, {
		// 			trigger: true
		// 		});

		// 		break;
		// }

		// let message = ((type === "person") ? "author" : "publication");
		// message = message.charAt(0).toUpperCase() + message.substr(1) + " saved";
		// messagesActions.send(message);
	};

	xhr(options, done);
};

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

			saveRelations(currentRelations, prevRelations, author._id);
		}


		save(
			config.authorUrl,
			parseOutgoingAuthor(author),
			getState().user.token,
			(response) =>
				dispatch({
					type: "RECEIVE_AUTHOR",
					response: response
				})
		);
	};
}


// export function fetchAuthor(id) {
// 	return function (dispatch, getState) {
// 		dispatch({type: "REQUEST_AUTHOR"});

// 		return fetch(
// 			config.authorUrl + "/" + id,
// 			(response) => dispatch({
// 				type: "RECEIVE_AUTHOR",
// 				response: response
// 			})
// 		);
// 	};
// }

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

export function deleteAuthor() {
	return function (dispatch, getState) {
		let id = getState().authors.current._id;

		remove(
			`${config.authorUrl}/${id}`,
			getState().user.token,
			() =>
				dispatch({
					type: "AUTHOR_DELETED",
					id: id
				})
		);
	};
}


export function authorSetKey(key, value) {
	return {
		type: "AUTHOR_SET_KEY",
		key: key,
		value: value
	};
}

export function authorDeleteKey(key) {
	return {
		type: "AUTHOR_DELETE_KEY",
		key: key
	};
}