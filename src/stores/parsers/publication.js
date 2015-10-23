import {iterateObjectKeys, parseRelations, splitRelations} from "./utils";

let inComingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}

	parseRelations(key, value, obj);
};

let outGoingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = value.toUpperCase();
	}

};
export let parseIncomingPublication = function(data) {
	iterateObjectKeys(data, inComingParser);
	splitRelations(data);
	return data;
};

export let parseOutgoingPublication = function(data) {
	iterateObjectKeys(data, outGoingParser);
	delete data["@removedRelations"];

	return data;
};