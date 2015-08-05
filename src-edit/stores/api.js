import xhr from "xhr";

import serverActions from "../actions/server";
import authorStore from "./author";
import publicationStore from "./publication";
import relationsStore from "./relations";

import relationMap, {relationTypes} from "./utils/relation-map";
import {parseIncomingAuthor, parseOutgoingAuthor} from "./parsers/author";
import {parseIncomingPublication, parseOutgoingPublication} from "./parsers/publication";

let baseUrl = "https://acc.repository.huygens.knaw.nl";
let authorUrl = baseUrl + "/domain/wwpersons";
let publicationUrl = baseUrl + "/domain/wwdocuments";
let relationUrl = "https://acc.repository.huygens.knaw.nl/domain/wwrelations";

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

let xhrPromiseCreator = function(url) {
	return function(data) {
		return new Promise(
			function (resolve, reject) {
				let options = {
					body: JSON.stringify(data),
					headers: {
						Authorization: localStorage.getItem("hi-womenwriters-auth-token"),
						"Content-Type": "application/json",
						VRE_ID: "WomenWriters"
					},
					method: "POST",
					url: url
				};

				let done = function(err, resp, body) {
					if (err) {
						reject(err);
					} else {
						resolve(body);
					}
				};

				xhr(options, done);
			}
		);
	};
};

let saveRelations = function(relations, sourceId) {
	let notEmpty = (name) =>
		relations[name].length > 0;

	let toRelationObjects = (name) =>
		relations[name].map((relation) => {
			let relationType = relationTypes[name];

			if (relationMap[name] == null) {
				console.error("Unknown relation: ", name);
			}

			let targetId = relation.key.substr(relation.key.lastIndexOf("/") + 1);

			if (relationType.regularName !== name) {
				[sourceId, targetId] = [targetId, sourceId];
			}

			return {
				"accepted": true,
				"@type": "wwrelation",
				"^typeId": relationType._id,
				"^sourceId": sourceId,
				"^sourceType": relationType.sourceTypeName,
				"^targetId": targetId,
				"^targetType": relationType.targetTypeName
			};
		});

	let flatten = (prev, current) =>
		prev.concat(current);

	let relationObjects = Object.keys(relations)
		.filter(notEmpty)
		.map(toRelationObjects)
		.reduce(flatten);

	let relationSaver = xhrPromiseCreator(relationUrl);

	let promisedRelations = relationObjects.map(relationSaver);
	Promise.all(promisedRelations).then(function(response) {
		console.log(response);
	});
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

		// console.log(data);

		// saveRelations(data["@relations"], data._id);

		let [method, url] = (model.get("_id") != null) ?
			["PUT", authorUrl + "/" + model.get("_id")] :
			["POST", authorUrl];

		let options = {
			body: JSON.stringify(data),
			headers: {
				Authorization: localStorage.getItem("hi-womenwriters-auth-token"),
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
		let model = publicationStore.getState().publication;
		let data = parseOutgoingPublication(model.toJS());

		console.log(data);

		saveRelations(data["@relations"], data._id);

		let options = {
			body: JSON.stringify(data),
			headers: {
				Authorization: localStorage.getItem("hi-womenwriters-auth-token"),
				"Content-Type": "application/json",
				"VRE_ID": "WomenWriters"
			},
			method: "PUT",
			url: publicationUrl + "/" + model.get("_id")
		};

		let done = function(err) {
			if (err) { handleError(err); }
		};

		xhr(options, done);
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