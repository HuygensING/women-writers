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