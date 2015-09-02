import dispatcher from "../dispatcher";

import BaseStore from "./base";

const CHANGE_EVENT = "change";

class MessageStore extends BaseStore {
	constructor() {
		super();

		this.messages = [];
	}

	getState() {
		return {
			messages: this.messages
		};
	}

	receive(message) {
		this.messages = [...this.messages, message];
	}
}

let messageStore = new MessageStore();

let dispatcherCallback = function(payload) {
	switch(payload.action.actionType) {
		case "MESSAGE_RECEIVE":
			messageStore.receive(payload.action.message);
			break;
		default:
			return;
	}

	messageStore.emit(CHANGE_EVENT);
};

messageStore.dispatcherIndex = dispatcher.register(dispatcherCallback);

export default messageStore;