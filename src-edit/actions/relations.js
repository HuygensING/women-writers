import API from "../stores/api";

let relationsActions = {
	getRelations() {
		API.getRelations();
	}
};

export default relationsActions;