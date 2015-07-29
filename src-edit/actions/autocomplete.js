import dispatcher from "../dispatcher";
import API from "../api";

let autocompleteActions = {
	getLanguages(query) {
		API.getLanguages(query);
	}
};

export default autocompleteActions;