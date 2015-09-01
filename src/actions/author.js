import dispatcher from "../dispatcher";
import API from "../stores/api";

let authorActions = {
	getAuthor(id) {
		if (id != null) {
			API.getAuthor(id);
		} else {
			dispatcher.handleViewAction({
				actionType: "AUTHOR_NEW"
			});
		}
	},

	saveAuthor() {
		API.saveAuthor();
	},

	deleteAuthor() {
		API.deleteAuthor();
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