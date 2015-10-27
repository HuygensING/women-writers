let initialState = {
	author: {
		pendingSearchId: null,
		searchId: null
	},
	publication: {
		pendingSearchId: null,
		searchId: null
	}
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
		default:
			return state;
	}
}