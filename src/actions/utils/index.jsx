import xhr from "xhr";

const DEFAULT_HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"VRE_ID": "WomenWriters"
};

let checkForError = function(err, response, body) {
	// switch (response.statusCode) {
	// 	case 401:
	// 		messagesActions.send("Unauthorized");
	// 		return true;

	// 	case 403:
	// 		messagesActions.send("Forbidden");
	// 		return true;

	// 	case 404:
	// 		router.navigate("not-found", {
	// 			trigger: true
	// 		});
	// 		return true;
	// }

	return false;
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
};

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
		// switch (method) {
		// 	case "POST":
		// 		let location = response.headers.location;
		// 		let id = location.substr(location.lastIndexOf("/") + 1);

		// 		router.navigate(`${type}s/${id}`, {
		// 			trigger: true
		// 		});

		// 		break;

		// 	case "PUT":
		// 		body = parseIn(JSON.parse(body));
		// 		action(body);

		// 		router.navigate(`${type}s/${body._id}`, {
		// 			trigger: true
		// 		});

		// 		break;
		// }

		// let message = ((type === "person") ? "author" : "publication");
		// message = message.charAt(0).toUpperCase() + message.substr(1) + " saved";
		// messagesActions.send(message);
	};

	xhr(options, done);
};

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
		// if (response.statusCode === 204) {
		// 	router.navigate(`${type}s`, {
		// 		trigger: true
		// 	});
		// }
	};

	xhr(options, done);
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
};

// SAVE RELATIONS
// import relationsStore from "../relations";
import userStore from "../user";

let relationUrl = "https://acc.repository.huygens.knaw.nl/domain/wwrelations";

let toXhrPromise = token => data =>
	new Promise(
		function (resolve, reject) {
			let options = {
				body: JSON.stringify(data),
				headers: {
					Authorization: userStore.getState().user.get("token"),
					"Content-Type": "application/json",
					VRE_ID: "WomenWriters"
				},
				method: "POST",
				url: relationUrl
			};

			let done = function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(body);
				}
			};

			xhr(options, done);
		}
	)

let toObject = (prev, current) => {
	prev[current.regularName] = current;
	prev[current.inverseName] = current;

	return prev;
};

let toRelationObject = (relationName, relationType, sourceId, accepted) =>
	(id) => {
		id = id.substr(id.lastIndexOf("/") + 1);
		[sourceId, id] = (relationType.regularName === relationName) ?
			[sourceId, id] :
			[id, sourceId];

		return {
			"accepted": accepted,
			"@type": "wwrelation",
			"^typeId": relationType._id,
			"^sourceId": sourceId,
			"^sourceType": relationType.sourceTypeName,
			"^targetId": id,
			"^targetType": relationType.targetTypeName
		};
	};

let toRelationObjects = (relationsToSave, sourceId, accepted=true) =>
	(arr, relationName) => {
		let ids = relationsToSave[relationName];
		let relationTypes = relationsStore.getState().relations.reduce(toObject, {});
		let relationType = relationTypes[relationName];
		let relationObjects = ids.map(toRelationObject(relationName, relationType, sourceId, accepted));

		return arr.concat(relationObjects);
	};


/*
 * Reduce to an object with relation keys found in currentRelations, but not
 * in prevRelations. To find the removed relations, the parameters are flipped.
 *
 * @param {Array} prevRelations The relations received from the server, before editing.
 * @param {Array} currentRelations The edited relations, before being persisted to the server.
 * @returns {Function} Returns a reduce function with prevRelations and currentRelations in scope.
 */
let toFoundInCurrent = function(prevRelations, currentRelations) {
	return (obj, relationName) => {
		let found = currentRelations[relationName]
			.filter((relation) =>
				prevRelations[relationName].filter((prevRelation) =>
					prevRelation.key === relation.key
				).length === 0
			);

		if (found.length) {
			obj[relationName] = found.map((f) => f.key);
		}
		return obj;
	};
};

export function saveRelations(currentRelations, serverRelations, sourceId) {
	let relationNames = Object.keys(currentRelations);

	let added = relationNames
		.reduce(toFoundInCurrent(serverRelations, currentRelations), {});

	let removed = relationNames
		.reduce(toFoundInCurrent(currentRelations, serverRelations), {});

	added = Object.keys(added).reduce(toRelationObjects(added, sourceId), []);
	removed = Object.keys(removed).reduce(toRelationObjects(removed, sourceId, false), []);

	let promisedRelations = added.concat(removed).map(toXhrPromise(token));
	Promise.all(promisedRelations).then((response) => {
		console.log(response);
	});
}