import relationMap from "../utils/relation-map";
import config from "../../config";
import {iterateObjectKeys} from "./utils";

let inComingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = value.charAt(0) + value.substr(1).toLowerCase();
	}


	if (relationMap.hasOwnProperty(key)) {
		obj[key] = value
			.filter((v) => v.accepted)
			.map((v) => {
				return {
					key: `${config.domainUrl}/${relationMap[key]}/${v.id}`,
					value: v.displayName
				};
			});
	}
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