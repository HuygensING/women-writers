import xhr from "xhr";
import config from "../config";
import checkForError from "../server-error";


const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

let cachedRelations = null;

export function requestRelations(cb) {
	if(localStorage.getItem("relations")) {
		cachedRelations = JSON.parse(localStorage.getItem("relations"));
		cb(cachedRelations);
		return;
	}
	let options = {
		headers: DEFAULT_HEADERS,
		url: config.relationsUrl
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			cb();
			return;
		}
		localStorage.setItem("relations", body);
		cachedRelations = JSON.parse(body);
		cb(cachedRelations);
	};

	xhr(options, done);
}

export function fetchRelations() {
	return function (dispatch) {
		dispatch({type: "REQUEST_RELATIONS"});

		return requestRelations(
			(response) => dispatch({
				type: "RECEIVE_RELATIONS",
				response: response
			})
		);
	};
}
