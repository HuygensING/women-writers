let initialState = {
	author: {
		pendingSearchId: null
	},
	publication: {
		pendingSearchId: null
	}
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_PENDING_AUTHOR_SEARCH_ID":
			return {
				...state,
				...{author: {
					...state.author,
					pendingSearchId: action.searchId
				}}
			};
		case "SET_PENDING_PUBLICATION_SEARCH_ID":
			return {
				...state,
				...{publication: {
					...state.publication,
					pendingSearchId: action.searchId
				}}
			};
		default:
			return state;
	}
}

/*
export function setPendingSearchId(searchId, type) {
	switch(type) {
		case "author":
			return { type: "SET_PENDING_AUTHOR_SEARCH_ID", searchId: searchId };
		case "publication":
			return { type: "SET_PENDING_PUBLICATION_SEARCH_ID", searchId: searchId };
	}
}

export function setAuthorSearchId(searchId, type) {
	switch(type) {
		case "author":
			return { type: "SET_AUTHOR_SEARCH_ID", searchId: searchId };
		case "publication":
			return { type: "SET_PUBLICATION_SEARCH_ID", searchId: searchId };
	}
}

export function movePendingSearchIdToActive(type) {
	switch(type) {
		case "author":
			return { type: "MOVE_PENDING_AUTHOR_SEARCH_ID_TO_ACTIVE" };
		case "publication":
			return { type: "MOVE_PENDING_PUBLICATION_SEARCH_ID_TO_ACTIVE" };
	}
}
*/
