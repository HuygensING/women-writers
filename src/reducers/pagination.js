const initialState = {
	authorPages: [],
	publicationPages: [],
	authorReceptionPages: [],
	publicationReceptionPages: {
		documentIds: [],
		receptionIds: []
	},
	collectivePages: []
};


export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_AUTHOR_PAGES":
			if (!state.authorRequestTime || state.authorRequestTime < action.requestTime) {
				return {...state, authorPages: action.ids, authorRequestTime: action.requestTime };
			}
			console.log("Ignoring expired request author pagination");
			console.log(`Most recent request time: ${state.authorRequestTime}, delayed response's request time ${action.requestTime}`);
			break;

		case "SET_PUBLICATION_PAGES":
			if (!state.publicationRequestTime || state.publicationRequestTime < action.requestTime) {
				return {...state, publicationPages: action.ids, publicationRequestTime: action.requestTime };
			}
			console.log("Ignoring expired request publication pagination");
			console.log(`Most recent request time: ${state.publicationRequestTime}, delayed response's request time ${action.requestTime}`);
			break;

		case "SET_AUTHOR_RECEPTION_PAGES":
			if (!state.authorReceptionRequestTime || state.authorReceptionRequestTime < action.requestTime) {
				return {...state, authorReceptionPages: action.ids, authorReceptionRequestTime: action.requestTime };
			}
			console.log("Ignoring expired request author-reception pagination");
			console.log(`Most recent request time: ${state.authorReceptionRequestTime}, delayed response's request time ${action.requestTime}`);
			break;

		case "SET_PUBLICATION_RECEPTION_PAGES":
			if (!state.publicationReceptionRequestTime || state.publicationReceptionRequestTime < action.requestTime) {
				return {
					...state,
					publicationReceptionPages: {
						documentIds: action.documentIds,
						receptionIds: action.receptionIds
					},
					publicationReceptionRequestTime: action.requestTime
				};
			}
			console.log("Ignoring expired request publication-reception pagination");
			console.log(`Most recent request time: ${state.publicationReceptionRequestTime}, delayed response's request time ${action.requestTime}`);
			break;

		case "SET_COLLECTIVE_PAGES":
			if (!state.collectiveRequestTime || state.collectiveRequestTime < action.requestTime) {
				return {...state, collectivePages: action.ids, collectiveRequestTime: action.requestTime };
			}
			console.log("Ignoring expired request collective pagination");
			console.log(`Most recent request time: ${state.collectiveRequestTime}, delayed response's request time ${action.requestTime}`);
			break;
	}
	return state;
}