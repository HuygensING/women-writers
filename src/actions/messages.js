import dispatcher from "../dispatcher";

let messagesActions = {
	send(message) {
		dispatcher.handleViewAction({
			actionType: "MESSAGE_RECEIVE",
			message: message
		});
	}
};

export default messagesActions;