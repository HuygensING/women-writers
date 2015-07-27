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

let relationMap = {
	isCreatedBy: "author",
	hasPublishLocation: "publishLocation",
	hasGenre: "genre",
	hasWorkLanguage: "language"
};


let inComingParser = function(key, value, obj) {
	if (key === "documentType") {
		obj[key] = {
			key: value,
			value: value
		};
	}


	if (relationMap.hasOwnProperty(key)) {
		obj[relationMap[key]] = {
			key: "https://acc.repository.huygens.knaw.nl/domain/wwkeywords/" + value[0].id,
			value: value[0].displayName
		};

		delete obj[key];
	}
};

let outGoingParser = function(key, value, obj) {

};

export let parseIncomingPublication = function(data) {
	iterateObjectKeys(data, inComingParser);

	return data;
};

export let parseOutgoingPublication = function(data) {
	iterateObjectKeys(data, outGoingParser);

	return data;
};