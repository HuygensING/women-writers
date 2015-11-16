let initialState = {
	author: {
		pendingSearchId: null,
		searchId: null
	},
	publication: {
		pendingSearchId: null,
		searchId: null
	},
	storedSearchQuery: null,
	awaitingQuery: null
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_PENDING_AUTHOR_SEARCH_ID":
			return {
				...state,
				...{author: {
					...state.author,
					pendingSearchId: action.searchId,
					searchId: null
				}}
			};
		case "SET_PENDING_PUBLICATION_SEARCH_ID":
			return {
				...state,
				...{publication: {
					...state.publication,
					pendingSearchId: action.searchId,
					searchId: null
				}}
			};
		case "SET_AUTHOR_SEARCH_ID":
			return {
				...state,
				...{author: {
					...state.author,
					pendingSearchId: null,
					searchId: action.searchId
				}}
			};
		case "SET_PUBLICATION_SEARCH_ID":
			return {
				...state,
				...{publication: {
					...state.publication,
					pendingSearchId: null,
					searchId: action.searchId
				}}
			};

		case "CHANGE_ROUTE":
			if(action.handler === "storedSearch" && action.props[0] === "receptions") {
				return {...state, storedSearchQuery: JSON.parse(action.props[1])};
			}
			return state;

		case "UPDATE_RECEPTION_STORED_QUERY":
			return {...state, storedSearchQuery: null, awaitingQuery: action.query};


		default:
			return state;
	}
}