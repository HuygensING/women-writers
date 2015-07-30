import xhr from "xhr";

import serverActions from "./actions/server";
import authorStore from "./stores/author";

import {parseIncomingAuthor, parseOutgoingAuthor} from "./parsers/author";
import {parseIncomingPublication, parseOutgoingPublication} from "./parsers/publication";

let baseUrl = "https://acc.repository.huygens.knaw.nl";
let authorUrl = baseUrl + "/domain/wwpersons";

let handleError = function(err, resp, body) {
	console.error("Some xhr request failed!", err);
};

let getAutocompleteValues = function(name, query, done) {
	let options = {
		headers: {
			"Content-Type": "application/json",
			"VRE_ID": "WomenWriters"
		},
		url: `${baseUrl}/v2/domain/ww${name}/autocomplete?query=*${query}*`
	};

	let xhrDone = function(err, resp, body) {
		if (err) { handleError(err); }

		done(JSON.parse(body));
	};

	xhr(options, xhrDone);
};

let getSelectValues = function(name, done) {
	let options = {
		headers: {
			"Content-Type": "application/json",
			"VRE_ID": "WomenWriters"
		},
		url: `${baseUrl}/v2/domain/wwkeywords/autocomplete?type=${name}&rows=1000`
	};

	let xhrDone = function(err, resp, body) {
		if (err) { handleError(err); }

		done(JSON.parse(body));
	};

	xhr(options, xhrDone);
};

export default {
	getAuthor(id) {
		let options = {
			headers: {
				"Content-Type": "application/json"
			},
			url: authorUrl + "/" + id
		};

		let done = function(err, resp, body) {
			if (err) { handleError(err, resp, body); }

			body = parseIncomingAuthor(JSON.parse(body));

			serverActions.receiveAuthor(body);
		};

		xhr(options, done);
	},

	saveAuthor() {
		let model = authorStore.getState().author;
		let data = parseOutgoingAuthor(model.toJS());

		console.log("FIX IT!", data);

		return;
		// TODO fix authorization
		// TODO fix error messages

		let options = {
			body: JSON.stringify(data),
			headers: {
				Authorization: localStorage.getItem("hi-womenwriters-auth-token"),
				"Content-Type": "application/json"
			},
			method: "PUT",
			url: authorUrl + "/" + model.get("_id")
		};

		let done = function(err) {
			if (err) { handleError(err); }
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
			if (err) { handleError(err, resp, body); }

			body = parseIncomingPublication(JSON.parse(body));

			serverActions.receivePublication(body);
		};

		xhr(options, done);
	},

	getLanguages(query, done) {
		getAutocompleteValues("languages", query, done);
	},

	getPersons(query, done) {
		getAutocompleteValues("persons", query, done);
	},

	getLocations(query, done) {
		getAutocompleteValues("locations", query, done);
	},

	getCollectives(query, done) {
		getAutocompleteValues("collectives", query, done);
	},

	getMaritalStatus(done) {
		getSelectValues("maritalStatus", done);
	},

	getFinancialSituation(done) {
		getSelectValues("financialSituation", done);
	},

	getEducation(done) {
		getSelectValues("education", done);
	},

	getProfession(done) {
		getSelectValues("profession", done);
	},

	getReligion(done) {
		getSelectValues("religion", done);
	},

	getSocialClass(done) {
		getSelectValues("socialClass", done);
	},

	getDocSourceType(done) {
		getSelectValues("docSourceType", done);
	},

	getGenre(done) {
		getSelectValues("genre", done);
	}
};