import {iterateObjectKeys, parseRelations} from "./utils";

let inComingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}

	parseRelations(key, value, obj);
};

let outGoingParser = function(key, value, obj) {
	if (key.substr(0, 4) === "temp") {
		delete obj[key];
	}

	if (key === "documentType") {
		obj[key] = value.toUpperCase();
	}
};
export let parseIncomingPublication = function(data) {
	iterateObjectKeys(data, inComingParser);

	return data;
};

export let parseOutgoingPublication = function(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};