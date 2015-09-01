import dispatcher from "../dispatcher";
import API from "../stores/api";

let publicationActions = {
	getPublication(id) {
		if (id != null) {
			API.getPublication(id);
		} else {
			dispatcher.handleViewAction({
				actionType: "PUBLICATION_NEW"
			});
		}
	},

	savePublication() {
		API.savePublication();
	},

	deletePublication() {
		API.deletePublication();
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