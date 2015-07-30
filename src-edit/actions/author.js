import dispatcher from "../dispatcher";
import API from "../api";

let authorActions = {
	getAuthor(id) {
		API.getAuthor(id);
	},

	saveAuthor(id) {
		API.saveAuthor(id);
	},

	setKey(key, value) {
		dispatcher.handleViewAction({
			actionType: "AUTHOR_SET_KEY",
			key: key,
			value: value
		});
	},

	deleteKey(key) {
		dispatcher.handleViewAction({
			actionType: "AUTHOR_DELETE_KEY",
			key: key
		});
	}
};

export default authorActions;