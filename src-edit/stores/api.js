import xhr from "xhr";

import serverActions from "../actions/server";

import userStore from "./user";
import authorStore from "./author";
import publicationStore from "./publication";

import {parseIncomingAuthor, parseOutgoingAuthor} from "./parsers/author";
import {parseIncomingPublication, parseOutgoingPublication} from "./parsers/publication";

import saveRelations from "./utils/save-relations";

let baseUrl = "https://acc.repository.huygens.knaw.nl";
let authorUrl = baseUrl + "/domain/wwpersons";
let publicationUrl = baseUrl + "/domain/wwdocuments";

let handleError = function(err, resp, body) {
	console.error("Some xhr request failed!", err, resp, body);
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

let save = function(type, token, model, serverModel, parse, url) {
	let data = parse(model.toJS());

	// Only save relations if the entity has been saved (has an ID).
	if (model.get("_id") != null ) {
		let currentRelations = model.get("@relations").toJS();
		let prevRelations = serverModel.get("@relations").toJS();

		saveRelations(currentRelations, prevRelations, data._id);
	}

	let [method, theUrl] = (model.get("_id") != null) ?
		["PUT", url + "/" + model.get("_id")] :
		["POST", url];

	let options = {
		body: JSON.stringify(data),
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
			"VRE_ID": "WomenWriters"
		},
		method: method,
		url: theUrl
	};

	let done = function(err, response, body) {
		if (err) { handleError(err, response, body); }

		if (model.get("_id") == null) {
			let location = response.headers.location;
			let id = location.substr(location.lastIndexOf("/") + 1);
			let locationUrl = `/womenwriters/${type}s/${id}`;

			window.location.assign(locationUrl);
		}
	};

	xhr(options, done);
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
		let userState = userStore.getState();
		let authorState = authorStore.getState();
		let model = authorState.author;
		let data = parseOutgoingAuthor(model.toJS());

		let currentRelations = model.get("@relations").toJS();
		let prevRelations = authorState.serverAuthor.get("@relations").toJS();

		saveRelations(currentRelations, prevRelations, data._id);

		let [method, url] = (model.get("_id") != null) ?
			["PUT", authorUrl + "/" + model.get("_id")] :
			["POST", authorUrl];

		let options = {
			body: JSON.stringify(data),
			headers: {
				Authorization: userState.user.get("token"),
				"Content-Type": "application/json",
				"VRE_ID": "WomenWriters"
			},
			method: method,
			url: url
		};

		let done = function(err, response, body) {
			if (err) { handleError(err, response, body); }

			if (model.get("_id") == null) {
				let location = response.headers.location;
				let id = location.substr(location.lastIndexOf("/") + 1);
				let locationUrl = `/womenwriters/persons/${id}`;

				window.location.assign(locationUrl);
			}
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

	savePublication() {
		let state = publicationStore.getState();

		save("document",
			userStore.getState().user.get("token"),
			state.publication,
			state.serverPublication,
			parseOutgoingPublication,
			publicationUrl);

		// let userState = userStore.getState();
		// let data = parseOutgoingPublication(model.toJS());

		// let currentRelations = model.get("@relations").toJS();
		// let prevRelations = state.serverPublication.get("@relations").toJS();

		// saveRelations(currentRelations, prevRelations, data._id);

		// let options = {
		// 	body: JSON.stringify(data),
		// 	headers: {
		// 		Authorization: userState.user.get("token"),
		// 		"Content-Type": "application/json",
		// 		"VRE_ID": "WomenWriters"
		// 	},
		// 	method: "PUT",
		// 	url: publicationUrl + "/" + model.get("_id")
		// };

		// let done = function(err) {
		// 	if (err) { handleError(err); }
		// };

		// xhr(options, done);
	},

	getRelations() {
		let options = {
			url: `${baseUrl}/system/relationtypes`
		};

		let done = function(err, resp, body) {
			if (err) { handleError(err, resp, body); }

			serverActions.receiveRelations(JSON.parse(body));
		};

		xhr(options, done);
	},

	getLanguages(query, done) {
		getAutocompleteValues("languages", query, done);
	},

	getPersons(query, done) {
		getAutocompleteValues("persons", query, done);
	},

	getDocuments(query, done) {
		getAutocompleteValues("documents", query, done);
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