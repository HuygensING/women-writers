import {iterateObjectKeys, parseRelations, splitRelations} from "./utils";

let inComingParser = function(key, value, obj) {

	if (key === "types") {
		obj[key] = value.map((v) =>
			v.charAt(0) + v.substr(1).toLowerCase());
	}

	if ((key === "gender") || (key === "children")) {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}

};

let outGoingParser = function(key, value, obj) {
	if (key === "types") {
		obj[key] = value.map((v) =>
			v.toUpperCase());
	}

	if ((key === "gender") || (key === "children")) {
		obj[key] = value.toUpperCase();
	}
};

export let parseIncomingAuthor = function(data) {
	iterateObjectKeys(data, inComingParser);
	parseRelations(data);
	splitRelations(data);
	return data;
};

export let parseOutgoingAuthor = function(data) {
	iterateObjectKeys(data, outGoingParser);
	delete data["@removedRelations"];

	return data;
};