const filterAccepted = function(v) { return v.accepted; };
const filterRemoved = function(v) { return !v.accepted; };

// split removed relations from accepted relations
export function splitRelations(data) {
	for(let name in data["@relations"]) {
		let accepted = data["@relations"][name].filter(filterAccepted);
		let removed = data["@relations"][name].filter(filterRemoved);
		if(accepted.length) {
			data["@relations"][name] = accepted;
		} else {
			delete data["@relations"][name];
		}
		if(removed.length) {
			data["@removedRelations"] = data["@removedRelations"] || {};
			data["@removedRelations"][name] = removed;
		}
	}
}

export function iterateObjectKeys(obj, parser) {
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
}