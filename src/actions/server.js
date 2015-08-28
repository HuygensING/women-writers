import dispatcher from "../dispatcher";

let serverActions = {
	receiveAuthor(data) {
		dispatcher.handleServerAction({
			actionType: "AUTHOR_RECEIVE",
			data: data
		});
	},

	updateAuthor(data) {
		dispatcher.handleServerAction({
			actionType: "AUTHOR_UPDATE",
			data: data
		});
	},

	receivePublication(data) {
		dispatcher.handleServerAction({
			actionType: "PUBLICATION_RECEIVE",
			data: data
		});
	},

	updatePublication(data) {
		dispatcher.handleServerAction({
			actionType: "PUBLICATION_UPDATE",
			data: data
		});
	},

	receiveRelations(data) {
		dispatcher.handleServerAction({
			actionType: "RELATIONS_RECEIVE",
			data: data
		});
	}
};

export default serverActions;