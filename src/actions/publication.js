// import dispatcher from "../dispatcher";
// import API from "../stores/api";

// let publicationActions = {
// 	getPublication(id) {
// 		if (id != null) {
// 			API.getPublication(id);
// 		} else {
// 			dispatcher.handleViewAction({
// 				actionType: "PUBLICATION_NEW"
// 			});
// 		}
// 	},

// 	savePublication() {
// 		API.savePublication();
// 	},

// 	deletePublication() {
// 		API.deletePublication();
// 	},

// 	setKey(key, value) {
// 		dispatcher.handleViewAction({
// 			actionType: "PUBLICATION_SET_KEY",
// 			key: key,
// 			value: value
// 		});
// 	},

// 	deleteKey(key) {
// 		dispatcher.handleViewAction({
// 			actionType: "PUBLICATION_DELETE_KEY",
// 			key: key
// 		});
// 	}
// };

// export default publicationActions;

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