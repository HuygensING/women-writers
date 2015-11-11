import xhr from "xhr";
import checkForError from "../../server-error";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

export function fetch(url, cb) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		cb(JSON.parse(body));
	};

	xhr(options, done);
}

export function save(url, model, token, cb) {
	let [method, theUrl] = (model._id == null) ?
		["POST", url] :
		["PUT", url + "/" + model._id];

	let options = {
		body: JSON.stringify(model),
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: token
		}},
		method: method,
		url: theUrl
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		if (body == null && response.headers.location != null) {
			fetch(response.headers.location, cb);
		} else {
			cb(JSON.parse(body));
		}
	};

	xhr(options, done);
}

export function remove(url, token, cb) {
	let options = {
		headers: {...DEFAULT_HEADERS,	...{
			Authorization: token
		}},
		method: "DELETE",
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		cb();
	};

	xhr(options, done);
}

export function fetch(url, cb) {
	let options = {
		headers: DEFAULT_HEADERS,
		url: url
	};

	let done = function(err, response, body) {
		if (checkForError(err, response, body)) {
			return;
		}

		cb(JSON.parse(body));
	};

	xhr(options, done);
}

// SAVE RELATIONS
// import relationsStore from "../relations";
// import userStore from "../user";

import config from "../../config";

let toXhrPromise = token => data =>
	new Promise(
		function (resolve, reject) {
			let options = {
				body: JSON.stringify(data),
				headers: {
					Authorization: token,
					"Content-Type": "application/json",
					VRE_ID: "WomenWriters"
				},
				method: "POST",
				url: config.saveRelationUrl
			};

			let done = function(err, resp, body) {
				if (checkForError(err, resp, body)) {
					reject(err);
				} else {
					resolve(body);
				}
			};
			if(data._id && data["^rev"]) {
				options.method = "PUT";
				options.url = options.url + "/" + data._id;
			}
			xhr(options, done);
		}
	);

let toObject = (prev, current) => {
	prev[current.regularName] = current;
	prev[current.inverseName] = current;

	return prev;
};

let toRelationObject = (relationName, relationType, sourceId, accepted) => {
	return (obj) => {
		let id = obj.key;
		id = id.substr(id.lastIndexOf("/") + 1);
		let [newSourceId, newId] = (relationType.regularName === relationName) ?
			[sourceId, id] :
			[id, sourceId];

		let saveObj = {
			"accepted": accepted,
			"@type": "wwrelation",
			"^typeId": relationType._id,
			"^sourceId": newSourceId,
			"^sourceType": relationType.sourceTypeName,
			"^targetId": newId,
			"^targetType": relationType.targetTypeName
		};
		if(obj["^rev"]) { saveObj["^rev"] = obj["^rev"]; }
		if(obj.relationId) { saveObj._id = obj.relationId; }
		if(obj.date) { saveObj.date = obj.date; }
		return saveObj;
	};
};

let toRelationObjects = (relationsToSave, sourceId, allRelations, accepted=true) => {
	return (arr, relationName) => {
		let ids = relationsToSave[relationName];
		let relationTypes = allRelations.reduce(toObject, {});
		let relationType = relationTypes[relationName];
		let relationObjects = ids.map(toRelationObject(relationName, relationType, sourceId, accepted));

		return arr.concat(relationObjects);
	};
};

/*
 * Reduce to an object with relation keys found in currentRelations, but not
 * in prevRelations. To find the removed relations, the parameters are flipped.
 *
 * @param {object} prevRelations The relations received from the server, before editing.
 * @param {object} currentRelations The edited relations, before being persisted to the server.
 * @param {object} serverRemoved Relations which were previously removed on the server
 * 		if relation was previously removed then readding it requires a PUT request with its original
 *		ID.
 * @returns {Function} Returns a reduce function with prevRelations and currentRelations in scope.
 */
let toFoundInCurrent = function(prevRelations, currentRelations, serverRemoved = {}) {
	return (obj, relationName) => {
		if (currentRelations.hasOwnProperty(relationName)) {
			let found = currentRelations[relationName]
				.filter((relation) =>
					!prevRelations.hasOwnProperty(relationName) || prevRelations[relationName].filter((prevRelation) =>
						prevRelation.key === relation.key && prevRelation.date === relation.date
					).length === 0
				).map((relation) => {
					if(serverRemoved.hasOwnProperty(relationName)) {
						for(let remRel of serverRemoved[relationName]) {
							if(remRel.key.replace(/.+\//, "") === relation.key.replace(/.+\//, "")) {
								relation.rev = remRel.rev;
								relation.relationId = remRel.relationId;
							}
						}
					}
					return relation;
				});

			if (found.length) {
				obj[relationName] = found.map((f) => {
					return {
						key: f.key,
						"^rev": f.rev || false,
						relationId: f.relationId || false,
						date: f.date || false
					};
				});
			}
		}
		return obj;
	};
};

export function saveRelations(currentRelations, serverRelations, serverRemovedRelations, allRelations, sourceId, token, saveCallback) {
	let relationNames = Object.keys(currentRelations);
	let added = relationNames
		.reduce(toFoundInCurrent(serverRelations, currentRelations, serverRemovedRelations), {});

	let removed = relationNames
		.reduce(toFoundInCurrent(currentRelations, serverRelations), {});

	added = Object.keys(added).reduce(toRelationObjects(added, sourceId, allRelations), []);
	removed = Object.keys(removed).reduce(toRelationObjects(removed, sourceId, allRelations, false), []);

	let promisedRelations = added.concat(removed).map(toXhrPromise(token));
	Promise.all(promisedRelations).then((responses) => {
		console.log("promises done ", responses);
		console.log("invoke save callback", saveCallback);
		saveCallback();
	});


}