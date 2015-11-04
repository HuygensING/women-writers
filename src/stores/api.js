import xhr from "xhr";
import checkForError from "../server-error";
import config from "../config";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
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
			done();
			return;
		}
		selectValues[name] = JSON.parse(body);
		done(selectValues[name]);
	};

	xhr(options, xhrDone);
};

export default {

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