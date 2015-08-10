// TODO Remove uncamel cased vars
import Immutable from "immutable";

import dispatcher from "../dispatcher";

import BaseStore from "./base";
import publicationModel from "./models/publication";

import {castArray} from "hire-forms-utils";

const CHANGE_EVENT = "change";

let diffData = function(receivedData) {
	let contract = publicationModel.keySeq().toArray();
	// let serverContract = ["@type", "names", "gender", "birthDate", "deathDate", "types", "links", "floruit", "bibliography", "children", "fsPseudonyms", "health", "livedIn", "nationality", "notes", "personalSituation", "tempOldId", "tempBirthPlace", "tempChildren", "tempCollaborations", "tempDeathPlace", "tempDeath", "tempFinancialSituation", "tempMemberships", "tempMotherTongue", "tempName", "tempPlaceOfBirth", "tempPsChildren", "tempPseudonyms", "tempSpouse", "relatedLocations", "_id", "^rev", "^created", "^modified", "^pid", "^deleted", "@relationCount", "@properties", "@relations", "@variationRefs"];

	let receivedProps = Object.keys(receivedData);

	let addedProps = receivedProps.filter((prop) =>
		contract.indexOf(prop) === -1
	);

	let removedProps = contract.filter((prop) =>
		receivedProps.indexOf(prop) === -1
	);

	return {
		added: addedProps,
		removed: removedProps
	};
};


class PublicationStore extends BaseStore {
	constructor() {
		super();

		this.setDefaults();
	}

	getState() {
		return {
			publication: this.model,
			serverPublication: this.serverModel
		};
	}

	setDefaults() {
		this.serverModel = publicationModel;
		this.model = publicationModel;
	}

	setKey(key, value) {
		key = castArray(key);
		value = Immutable.fromJS(value);
		// // Turn an array into an Immutable.List
		// if (Array.isArray(value)) {
		// 	value = new Immutable.List(value);
		// }

		// // Turn a key-value object into an Immutable.Map
		// if (value.hasOwnProperty("key")) {
		// 	value = new Immutable.Map(value);
		// }

		this.model = this.model.setIn(key, value);
	}

	deleteKey(key) {
		this.model = this.model.deleteIn(key);
	}

	receive(data) {
		let diff = diffData(data);
		if ((diff.added.length > 0) || (diff.removed.length > 0)) {
			console.warn("Contracts mismatch! ", diff);
		}

		this.model = publicationModel.mergeDeep(Immutable.fromJS(data));
		this.serverModel = this.model;
	}
}

let publicationStore = new PublicationStore();

let dispatcherCallback = function(payload) {
	switch(payload.action.actionType) {
		case "PUBLICATION_RECEIVE":
			publicationStore.receive(payload.action.data);
			break;
		case "PUBLICATION_SET_KEY":
			publicationStore.setKey(payload.action.key, payload.action.value);
			break;
		case "PUBLICATION_DELETE_KEY":
			publicationStore.deleteKey(payload.action.key);
			break;
		case "PUBLICATION_NEW":
			publicationStore.setDefaults();
			break;
		default:
			return;
	}

	publicationStore.emit(CHANGE_EVENT);
};

publicationStore.dispatcherIndex = dispatcher.register(dispatcherCallback);

export default publicationStore;