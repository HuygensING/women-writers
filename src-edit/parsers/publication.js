import relationMap from "../stores/utils/relation-map";

let iterateObjectKeys = function(obj, parser) {
	let isObject = function(o) {
		return o !== null && !Array.isArray(o) && typeof o === "object";
	};

	Object.keys(obj).forEach((key) => {
		let value = obj[key];

		if (Array.isArray(value)) {
			if (value.length && isObject(value[0])) {
				value.forEach((nestedObject) =>
					iterateObjectKeys(nestedObject, parser)
				);
			}
		} else if (isObject(value)) {
			iterateObjectKeys(value, parser);
		}

		parser(key, value, obj);
	});
};

// let relationMap = {
// 	isCreatedBy: "wwpersons",
// 	hasPublishLocation: "wwlocations",
// 	hasGenre: "wwkeywords",
// 	hasWorkLanguage: "wwlanguages"
// };


let inComingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = {
			key: value,
			value: value
		};
	}


	if (relationMap.hasOwnProperty(key)) {
		obj[key] = value.map((v) => {
			return {
				key: `https://acc.repository.huygens.knaw.nl/domain/${relationMap[key]}/${v.id}`,
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
		obj[key] = value.value;
	}
	// if ((key === "gender") || (key === "children")) {
	// 	obj[key] = value.toUpperCase();
	// }

	// if (key === "names") {
	// 	obj[key] = value.map((names) => {
	// 		return {
	// 			components: [{
	// 					type: "FORENAME",
	// 					value: names.firstName
	// 				}, {
	// 					type: "SURNAME",
	// 					value: names.lastName
	// 				}
	// 			]
	// 		};
	// 	});
	// }

	// if (key === "persontype") {
	// 	delete obj[key];
	// }
};
export let parseIncomingPublication = function(data) {
	iterateObjectKeys(data, inComingParser);

	return data;
};

export let parseOutgoingPublication = function(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};