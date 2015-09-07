// import API from "../stores/api";

// let firstTime = true;

// let relationsActions = {
// 	getRelations() {
// 		if (firstTime) {
// 			API.getRelations();
// 		}
// 	}
// };

// export default relationsActions;
import xhr from "xhr";
import config from "../config";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

let fetch = function(url, cb) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: url
	};

	let done = function(err, response, body) {
		if (err) { handleError(err, response, body); }

		cb(JSON.parse(body));
	};

	xhr(options, done);
};

export function fetchRelations() {
	return function (dispatch, getState) {
		dispatch({type: "REQUEST_RELATIONS"});

		return fetch(
			config.relationsUrl,
			(response) => dispatch({
				type: "RECEIVE_RELATIONS",
				response: response
			})
		);
	};
}
