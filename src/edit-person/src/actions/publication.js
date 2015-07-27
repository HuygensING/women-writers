import dispatcher from "../dispatcher";
import API from "../api";

let publicationActions = {
	getPublication(id) {
		API.getPublication(id);
	},

	setKey(key, value) {
		dispatcher.handleViewAction({
			actionType: "PUBLICATION_SET_KEY",
			key: key,
			value: value
		});
	},

	deleteKey(key) {
		dispatcher.handleViewAction({
			actionType: "PUBLICATION_DELETE_KEY",
			key: key
		});
	}
};

export default publicationActions;