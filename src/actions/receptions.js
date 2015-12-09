export function setPendingSearchId(searchId, type) {
	switch(type) {
		case "author":
			return { type: "SET_PENDING_AUTHOR_SEARCH_ID", searchId: searchId };
		case "publication":
			return { type: "SET_PENDING_PUBLICATION_SEARCH_ID", searchId: searchId };
	}
}

export function setSearchId(searchId, type) {
	switch(type) {
		case "author":
			return { type: "SET_AUTHOR_SEARCH_ID", searchId: searchId };
		case "publication":
			return { type: "SET_PUBLICATION_SEARCH_ID", searchId: searchId };
	}
}