import { SolrClient } from "solr-faceted-search-react";

import store from "../reducers/store";

const personFields = [{
	label: "Authors",
	field: "modified_l",
	type: "range-facet",
	value: [new Date(new Date().setMonth(new Date().getMonth() - 2)).getTime(), new Date().getTime()]}
];

const personSortFields = [
	{label: "Modified", field: "modified_l", value: "desc"}
];

const personFilters = [
	{field: "type_s", value: "person"},
];

const personSearchClient = new SolrClient({
	url: "/repositorysolr/wwpersons",
	searchFields: personFields,
	sortFields: personSortFields,
	rows: 100,
	pageStrategy: "cursor",
	idField: "id",
	filters: personFilters,
	onChange: (state) => {
		store.dispatch({type: "SET_PERSON_MODIFIED_SEARCH_STATE", state: state});
	}
});

export default personSearchClient;