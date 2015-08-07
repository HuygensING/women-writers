// import Immutable from "immutable";

import dispatcher from "../dispatcher";

import BaseStore from "./base";

import displayName from "./utils/relation-display-names";

let hasType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type || relation.targetTypeName === type;
};

let hasBothType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type && relation.targetTypeName === type;
};

let toDisplayName = function(prev, current) {
	prev[current.regularName] = displayName[current.regularName];
	prev[current.inverseName] = displayName[current.inverseName];

	return prev;
};

const CHANGE_EVENT = "change";

class RelationsStore extends BaseStore {
	constructor() {
		super();

		this.data = {
			relations: [],
			author: [],
			publication: [],
			authorPublication: []
		};
	}

	getState() {
		return this.data;
	}

	receive(relations) {
		let authorRelations = relations.filter(hasType("person"));
		let publicationRelations = relations.filter(hasType("document"))
		this.data = {
			relations: relations,
			relationDisplayNames: relations.reduce(toDisplayName, {}),
			authorRelations: authorRelations,
			authorPublicationRelations: authorRelations.filter(hasType("document")),
			publicationRelations: publicationRelations,
			publicationPublicationRelations: publicationRelations.filter(hasBothType("document"))
		};
	}
}

let relationsStore = new RelationsStore();

let dispatcherCallback = function(payload) {
	switch(payload.action.actionType) {
		case "RELATIONS_RECEIVE":
			relationsStore.receive(payload.action.data);
			break;
		default:
			return;
	}

	relationsStore.emit(CHANGE_EVENT);
};

relationsStore.dispatcherIndex = dispatcher.register(dispatcherCallback);

export default relationsStore;