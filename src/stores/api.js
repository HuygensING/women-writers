import xhr from "xhr";

import config from "../config";

import serverActions from "../actions/server";
import messagesActions from "../actions/messages";

import userStore from "./user";
import authorStore from "./author";
import publicationStore from "./publication";

import {parseIncomingAuthor, parseOutgoingAuthor} from "./parsers/author";
import {parseIncomingPublication, parseOutgoingPublication} from "./parsers/publication";

import saveRelations from "./utils/save-relations";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

let checkForError = function(err, response, body) {
	switch (response.statusCode) {
		case 401:
			messagesActions.send("Unauthorized");
			return true;

		case 403:
			messagesActions.send("Forbidden");
			return true;

		case 404:
			router.navigate("not-found", {
				trigger: true
			});
			return true;
	}

	return false;
};

let getAutocompleteValues = function(name, query, done) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: `${config.baseUrl}/domain/ww${name}/autocomplete?query=*${query}*`
	};

	let xhrDone = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		done(JSON.parse(body));
	};

	xhr(options, xhrDone);
};

let selectValues = {};

let getSelectValues = function(name, done) {
	if(selectValues[name]) {
		done(selectValues[name]);
		return;
	}

	let options = {
		headers: DEFAULT_HEADERS,
		url: `${config.baseUrl}/domain/wwkeywords/autocomplete?type=${name}&rows=1000`
	};

	let xhrDone = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}
		selectValues[name] = JSON.parse(body);
		done(selectValues[name]);
	};

	xhr(options, xhrDone);
};

let fetch = function(url, parse, action) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		body = parse(JSON.parse(body));

		action(body);
	};

	xhr(options, done);
};

let save = function(type, model, serverModel, parseOut, parseIn, action) {
	let data = parseOut(model.toJS());

	// Only save relations if the entity has been saved (has an ID).
	if (model.get("_id") != null ) {
		let currentRelations = model.get("@relations").toJS();
		let prevRelations = serverModel.get("@relations").toJS();

		saveRelations(currentRelations, prevRelations, data._id);
	}

	let url = (type === "person") ?
		config.authorUrl :
		config.publicationUrl;

	let [method, theUrl] = (model.get("_id") != null) ?
		["PUT", url + "/" + model.get("_id")] :
		["POST", url];

	let options = {
		body: JSON.stringify(data),
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: userStore.getState().user.get("token")
		}},
		method: method,
		url: theUrl
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		switch (method) {
			case "POST":
				let location = response.headers.location;
				let id = location.substr(location.lastIndexOf("/") + 1);

				router.navigate(`${type}s/${id}`, {
					trigger: true
				});

				break;

			case "PUT":
				body = parseIn(JSON.parse(body));
				action(body);

				router.navigate(`${type}s/${body._id}`, {
					trigger: true
				});

				break;
		}

		let message = ((type === "person") ? "author" : "publication");
		message = message.charAt(0).toUpperCase() + message.substr(1) + " saved";
		messagesActions.send(message);
	};

	xhr(options, done);
};

let remove = function(type, url) {
	let options = {
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: userStore.getState().user.get("token")
		}},
		method: "DELETE",
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		if (response.statusCode === 204) {
			router.navigate(`${type}s`, {
				trigger: true
			});
		}
	};

	xhr(options, done);
};

export default {
	getAuthor(id) {
		let url = config.authorUrl + "/" + id;
		fetch(
			url,
			parseIncomingAuthor,
			serverActions.receiveAuthor
		);
	},

	getPublication(id) {
		let url = config.publicationUrl + "/" + id;
		fetch(
			url,
			parseIncomingPublication,
			serverActions.receivePublication
		);
	},

	saveAuthor() {
		let state = authorStore.getState();

		save(
			"person",
			state.author,
			state.serverAuthor,
			parseOutgoingAuthor,
			parseIncomingAuthor,
			serverActions.receiveAuthor
		);
	},

	savePublication() {
		let state = publicationStore.getState();

		save(
			"document",
			state.publication,
			state.serverPublication,
			parseOutgoingPublication,
			parseIncomingPublication,
			serverActions.receivePublication
		);
	},

	deleteAuthor() {
		let id = authorStore.getState().author.get("_id");
		remove("person", config.authorUrl + "/" + id);
	},

	deletePublication() {
		let id = publicationStore.getState().publication.get("_id");
		remove("document", config.publicationUrl + "/" + id);
	},

	getRelations() {
		let options = {
			headers: DEFAULT_HEADERS,
			url: `${config.baseUrl}/system/relationtypes`
		};

		let done = function(err, response, body) {
			if (err) { handleError(err, response, body); }

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
	},

	autoWarm(next) {
		let promises = ["religion", "socialClass", "education", "maritalStatus", "profession", "financialSituation", "genre"]
			.map((selVal) => new Promise((resolve) => getSelectValues(selVal, resolve)));

		Promise.all(promises).then(() => next());
	}
};