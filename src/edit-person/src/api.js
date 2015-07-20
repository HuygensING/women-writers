import xhr from "xhr";

import serverActions from "./actions/server";

import {parseIncomingAuthor, parseOutgoingAuthor} from "./parsers/author";

let baseUrl = "https://acc.repository.huygens.knaw.nl";

let handleError = function(err, resp, body) {
	console.error("Some xhr request failed!", err);
};

export default {
	getAuthor(id) {
		let options = {
			headers: {
				"Content-Type": "application/json"
			},
			url: baseUrl + "/domain/wwpersons/" + id
		};

		let done = function(err, resp, body) {
			if (err) { handleError(err, resp, body); }

			body = parseIncomingAuthor(JSON.parse(body));

			serverActions.receiveAuthor(body);
		};

		xhr(options, done);
	},

	getPublication(id) {
		let options = {
			headers: {
				"Content-Type": "application/json"
			},
			url: baseUrl + "/domain/wwdocuments/" + id
		};

		let done = function(err, resp, body) {
			if (err) { handleError(err); }

			serverActions.receivePublication(JSON.parse(body));
		};

		xhr(options, done);
	}
};