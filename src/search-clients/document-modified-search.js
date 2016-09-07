import { SolrClient } from "solr-faceted-search-react";

import store from "../reducers/store";

const documentFields = [{
	label: "Publications",
	field: "modified_l",
	type: "range-facet",
	value: [new Date(new Date().setMonth(new Date().getMonth() - 2)).getTime(), new Date().getTime()]}
];

const documentSortFields = [
	{label: "Modified", field: "modified_l", value: "desc"}
];

const documentFilters = [
	{field: "type_s", value: "document"}
];

const documentSearchClient = new SolrClient({
	url: "/repositorysolr/wwdocuments",
	searchFields: documentFields,
	sortFields: documentSortFields,
	rows: 100,
	pageStrategy: "cursor",
	idField: "id",
	filters: documentFilters,
	onChange: (state) => {
		store.dispatch({type: "SET_DOCUMENT_MODIFIED_SEARCH_STATE", state: state});
	}
});

export default documentSearchClient;