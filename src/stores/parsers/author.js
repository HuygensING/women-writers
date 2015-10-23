import {iterateObjectKeys, parseRelations, splitRelations} from "./utils";

let inComingParser = function(key, value, obj) {
	if (key === "names") {
		obj[key] = value.map((names) => {
			return {
				firstName: names.components.length ? names.components[0].value : "",
				lastName: names.components.length > 1 ? names.components[1].value : ""
			};
		});
	}

	if (key === "types") {
		obj[key] = value.map((v) =>
			v.charAt(0) + v.substr(1).toLowerCase());
	}

	if ((key === "gender") || (key === "children")) {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}

	parseRelations(key, value, obj);
};

let outGoingParser = function(key, value, obj) {
	if (key.substr(0, 4) === "temp") {
		delete obj[key];
	}

	if (key === "types") {
		obj[key] = value.map((v) =>
			v.toUpperCase());
	}

	if ((key === "gender") || (key === "children")) {
		obj[key] = value.toUpperCase();
	}

	if (key === "names") {
		obj[key] = value.map((names) => {
			return {
				components: [{
						type: "FORENAME",
						value: names.firstName
					}, {
						type: "SURNAME",
						value: names.lastName
					}
				]
			};
		});
	}

	if (key === "persontype") {
		delete obj[key];
	}
};

export let parseIncomingAuthor = function(data) {
	iterateObjectKeys(data, inComingParser);
	splitRelations(data);
	return data;
};

export let parseOutgoingAuthor = function(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};