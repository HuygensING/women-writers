import clone from "../util/clone";
import { crud } from "./crud";
import saveRelations from "./relation-savers";
import config from "../config";

// Skeleton base data per field definition
const initialData = {
	names: [],
	multiselect: [],
	links: [],
	keyword: [],
	"list-of-strings": [],
	altnames: [],
	text: "",
	string: "",
	select: "",
	datable: ""
};

// Return the initial data for the type in the field definition
const initialDataForType = (fieldDef) =>
	fieldDef.defaultValue || (fieldDef.type === "relation" || fieldDef.type === "keyword" ? {} : initialData[fieldDef.type]);

// Return the initial name-key for a certain field type
const nameForType = (fieldDef) =>
	fieldDef.type === "relation" || fieldDef.type === "keyword" ? "@relations" : fieldDef.name;


// Create a new empty entity based on the fieldDefinitions
const makeSkeleton = function (vre, domain) {
	if (vre && vre.collections && vre.collections[domain] && vre.collections[domain].properties) {
		return vre.collections[domain].properties
			.map((fieldDef) => [nameForType(fieldDef), initialDataForType(fieldDef)])
			.concat([["@type", domain.replace(/s$/, "")]])
			.concat([["@variationRefs", []]])
			.reduce((obj, cur) => {
				obj[cur[0]] = cur[1];
				return obj;
			}, {});
	}
};

// 1) Fetch entity
// 2) Dispatch RECEIVE_ENTITY for render
const selectEntity = (domain, entityId, errorMessage = null, successMessage = null, next = () => { }) =>
	(dispatch) => {
		dispatch({type: "TRANSACTION_PENDING"});
		crud.fetchEntity(`${config.apiUrl[config.apiVersion]}/domain/${domain}/${entityId}`, (data) => {
			dispatch({type: "TRANSACTION_COMPLETE"});
			dispatch({type: "RECEIVE_ENTITY", domain: domain, data: data, errorMessage: errorMessage});
			if (successMessage !== null) {
				const ts = new Date().getTime();
				dispatch({type: "SUCCESS_MESSAGE", message: successMessage, ts: ts});
				setTimeout(() => dispatch({type: "DISMISS_MESSAGE_BY_TIMESTAMP", ts: ts}), 5000);
			}
			next(entityId);
		}, () => {
			dispatch({type: "RECEIVE_ENTITY_FAILURE", errorMessage: `Failed to fetch ${domain} with ID ${entityId}`})
			next(entityId);
		});
	};


// 1) Dispatch RECEIVE_ENTITY with empty entity skeleton for render
const makeNewEntity = (domain, errorMessage = null, next = () => {}) => (dispatch, getState) => {
	dispatch({type: "TRANSACTION_COMPLETE"});
	dispatch({
		type: "RECEIVE_ENTITY",
		domain: domain,
		data: makeSkeleton(getState().vre, domain) || {},
		errorMessage: errorMessage
	});
	next();
};

const deleteEntity = (onSuccess = () => {}, onError = () => {}) => (dispatch, getState) => {
	crud.deleteEntity(getState().entity.domain, getState().entity.data._id, getState().user.token, getState().vre.vreId,
		() => {
			const ts = new Date().getTime();
			dispatch({type: "SUCCESS_MESSAGE", message: `Sucessfully deleted ${getState().entity.domain} with ID ${getState().entity.data._id}`, ts: ts});
			setTimeout(() => dispatch({type: "DISMISS_MESSAGE_BY_TIMESTAMP", ts: ts}), 5000);
			onSuccess();
		},
		() => dispatch(selectEntity(getState().entity.domain, getState().entity.data._id, `Failed to delete ${getState().entity.domain} with ID ${getState().entity.data._id}`, onError)));
};

// 1) Save an entity
// 2) Save the relations for this entity
// 3) Refetch entity for render
const saveEntity = (onSuccess = () => {}, onError = () => {}) => (dispatch, getState) => {
	// Make a deep copy of the data to be saved in order to leave application state unaltered
	let saveData = clone(getState().entity.data);
	// Make a deep copy of the relation data in order to leave application state unaltered
	let relationData = clone(saveData["@relations"]) || {};
	// Delete the relation data from the saveData as it is not expected by the server
	delete saveData["@relations"];
	dispatch({type: "TRANSACTION_PENDING"});

	if (getState().entity.data._id) {
		// 1) Update the entity with saveData
		crud.updateEntity(getState().entity.domain, saveData, getState().user.token, getState().vre.vreId, (err, resp) =>
			// 2) Save relations using server response for current relations to diff against relationData
			dispatch((redispatch) => saveRelations[config.apiVersion](JSON.parse(resp.body), relationData, getState().vre.collections[getState().entity.domain].properties, getState().user.token, getState().vre.vreId, () =>
				// 3) Refetch entity for render
				redispatch(selectEntity(getState().entity.domain, getState().entity.data._id, null, `Succesfully saved ${getState().entity.domain} with ID ${getState().entity.data._id}`, onSuccess)))), () =>
					// 2a) Handle error by refetching and passing along an error message
					dispatch(selectEntity(getState().entity.domain, getState().entity.data._id, `Failed to save ${getState().entity.domain} with ID ${getState().entity.data._id}`, onError)));

	} else {
		// 1) Create new entity with saveData
		crud.saveNewEntity(getState().entity.domain, saveData, getState().user.token, getState().vre.vreId, (err, resp) =>
			// 2) Fetch entity via location header
			dispatch((redispatch) => crud.fetchEntity(resp.headers.location, (data) =>
				// 3) Save relations using server response for current relations to diff against relationData
				saveRelations[config.apiVersion](data, relationData, getState().vre.collections[getState().entity.domain].properties, getState().user.token, getState().vre.vreId, () =>
					// 4) Refetch entity for render
					redispatch(selectEntity(getState().entity.domain, data._id, null, `Succesfully saved ${getState().entity.domain}`, onSuccess))))), () =>
						// 2a) Handle error by refetching and passing along an error message
						dispatch(makeNewEntity(getState().entity.domain, `Failed to save new ${getState().entity.domain}`, onError)));
	}
};


export { saveEntity, selectEntity, makeNewEntity, deleteEntity };