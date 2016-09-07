import { SolrClient } from "solr-faceted-search-react";
import store from "../reducers/store";
import clone from "../util/clone";
import filtersAreEqual from "../util/filters-are-equal";
import { setDocumentReceptionsFiltersFromDocumentQuery } from "./document-reception-search-client";
import { setPublicationPages } from "../actions/pagination";

const documentFilters = [
	{field: "type_s", value: "document"}
];

const documentSortFields = [
	{label: "Author", field: "authorNameSort_s"},
	{label: "Title", field: "displayName_s"},
	{label: "Publication year", field: "date_i"},
	{label: "Country of first publication", field: "locationSort_s"},
	{label: "Language", field: "languageSort_s"}
];

const documentFields = [
	{label: "Title", field: "title_t", type: "text"},
	{label: "Publication year", field: "date_i", type: "range-facet"},
	{label: "Country of first publication", field: "publishLocation_ss", type: "list-facet", collapse: true},
	{label: "Language", field: "language_ss", type: "list-facet", collapse: true},
	{label: "Genre", field: "genre_ss", type: "list-facet", collapse: true},
	{label: "Sources", field: "source_ss", type: "list-facet", collapse: true},
	{label: "Document type", field: "documentType_s", type: "list-facet", collapse: true},
	{label: "Provisional notes", field: "notes_t", type: "text", collapse: true}
];


const documentSearchClient = new SolrClient({
	url: "/repositorysolr/wwdocuments",
	searchFields: documentFields,
	sortFields: documentSortFields,
	rows: 25,
	pageStrategy: "paginate",
	facetSort: "count",
	filters: documentFilters,
	onChange: (state) => {
		setDocumentReceptionsFiltersFromDocumentQuery(state);
		store.dispatch(setPublicationPages(state));
		store.dispatch({type: "SET_DOCUMENT_SEARCH_STATE", state: state});
	}
});


let lastFilters = clone(documentFilters);

const setDocumentFiltersFromPersonQuery = (personState) => {
	const filters = personState.query.searchFields
		.filter((searchField) => searchField.value && searchField.value.length > 0)
		.map((searchField) => ({
			field: `{!parent which=type_s:document}person_${searchField.field}`,
			value: searchField.field.match(/_t$/) ? `(${searchField.value})` : searchField.value,
			type: searchField.type,
			label: searchField.label
		}));

	if (!filtersAreEqual(lastFilters, filters)) {
		lastFilters = clone(filters);
		documentSearchClient.setFilters(filters.concat(documentFilters));
	}
};

const setDocumentQueryFromDocumentReceptionFilters = (field, value) =>
	documentSearchClient.setSearchFieldValue(field.replace(/^document_/, ""), value);

export { setDocumentFiltersFromPersonQuery, setDocumentQueryFromDocumentReceptionFilters };
export default documentSearchClient;