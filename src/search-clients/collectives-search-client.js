import { SolrClient } from "solr-faceted-search-react";

import store from "../reducers/store";
import {setCollectivePages} from "../actions/pagination";

const collectiveFields = [
	{ label: "Name", field: "name_t", type: "text" },
	{ label: "Type", field: "type_s", type: "list-facet"}
];

const collectiveSortFields = [
	{label: "Name", field: "displayName_s"}
];

const collectiveSearchClient = new SolrClient({
	url: "/repositorysolr/wwcollectives",
	searchFields: collectiveFields,
	sortFields: collectiveSortFields,
	rows: 25,
	pageStrategy: "paginate",
	onChange: (state) => {
		store.dispatch(setCollectivePages(state));
		store.dispatch({type: "SET_COLLECTIVE_SEARCH_STATE", state: state});
	}
});

export default collectiveSearchClient;