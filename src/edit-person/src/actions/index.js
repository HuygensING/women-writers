import dispatcher from "../dispatcher";

let personActions = {
	setKey(key, value) {
		dispatcher.handleViewAction({
			actionType: "PERSON_SET_KEY",
			key: key,
			value: value
		});
	},

	deleteKey(key) {
		dispatcher.handleViewAction({
			actionType: "PERSON_DELETE_KEY",
			key: key
		});
	}
};

export default personActions;