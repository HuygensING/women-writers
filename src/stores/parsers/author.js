import relationMap from "../utils/relation-map";
import config from "../../config";
import {iterateObjectKeys} from "./utils";

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

	return data;
};

export let parseOutgoingAuthor = function(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};