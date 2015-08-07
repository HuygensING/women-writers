import API from "../stores/api";

let firstTime = true;

let relationsActions = {
	getRelations() {
		if (firstTime) {
			API.getRelations();
		}
	}
};

export default relationsActions;