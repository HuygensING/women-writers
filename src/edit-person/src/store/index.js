// TODO Remove uncamel cased vars
import Immutable from "immutable";

import dispatcher from "../dispatcher";

import BaseStore from "./base";
import personModel from "./model";

import {castArray} from "hire-forms-utils";

const CHANGE_EVENT = "change";

class PersonStore extends BaseStore {
	constructor() {
		super();

		this.model = personModel;
	}

	getState() {
		return {
			person: this.model
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

let person = new PersonStore();

let dispatcherCallback = function(payload) {
	switch(payload.action.actionType) {
		case "PERSON_RECEIVE":
			person.receive(payload.action.data);
			break;
		case "PERSON_SET_KEY":
			person.setKey(payload.action.key, payload.action.value);
			break;
		case "PERSON_DELETE_KEY":
			person.deleteKey(payload.action.key);
			break;
		default:
			return;
	}

	person.emit(CHANGE_EVENT);
};

person.dispatcherIndex = dispatcher.register(dispatcherCallback);

export default person;