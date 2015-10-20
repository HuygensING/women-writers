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