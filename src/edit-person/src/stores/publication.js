// TODO Remove uncamel cased vars
import Immutable from "immutable";

import dispatcher from "../dispatcher";

import BaseStore from "./base";
import publicationModel from "./models/publication";

import {castArray} from "hire-forms-utils";

const CHANGE_EVENT = "change";

class PublicationStore extends BaseStore {
	constructor() {
		super();

		this.model = publicationModel;
	}

	getState() {
		return {
			publication: this.model
		};
	}

	setKey(key, value) {
		key = castArray(key);

		// Turn an array into an Immutable.List
		if (Array.isArray(value)) {
			value = new Immutable.List(value);
		}

		// Turn a key-value object into an Immutable.Map
		if (value.hasOwnProperty("key")) {
			value = new Immutable.Map(value);
		}

		this.model = this.model.setIn(key, value);
	}

	deleteKey(key) {
		this.model = this.model.deleteIn(key);
	}

	receive(data) {
		this.model = Immutable.fromJS(data);
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
		default:
			return;
	}

	publicationStore.emit(CHANGE_EVENT);
};

publicationStore.dispatcherIndex = dispatcher.register(dispatcherCallback);

export default publicationStore;