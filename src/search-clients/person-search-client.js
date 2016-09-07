import { SolrClient } from "solr-faceted-search-react";
import { setDocumentFiltersFromPersonQuery } from "./document-search-client";
import { setPersonReceptionsFiltersFromPersonQuery } from "./person-reception-search-client";
import { setAuthorPages } from "../actions/pagination";

import store from "../reducers/store";

const personFields = [
	{label: "Name", field: "name_t", type: "text"},
	{label: "Person Type", field: "types_ss", type: "list-facet"},
	{label: "Gender", field: "gender_s", type: "list-facet"},
	{label: "Country", field: "relatedLocations_ss", type: "list-facet", collapse: true},
	{label: "Language", field: "language_ss", type: "list-facet", collapse: true},
	{label: "Year of birth", field: "birthDate_i", type: "range-facet", collapse: true},
	{label: "Year of death", field: "deathDate_i", type: "range-facet", collapse: true},
	{label: "Place of birth", field: "birthPlace_ss", type: "list-facet", collapse: true},
	{label: "Place of death", field: "deathPlace_ss", type: "list-facet", collapse: true},
	{label: "Marital status", field: "maritalStatus_ss", type: "list-facet", collapse: true},
	{label: "Children", field: "children_s", type: "list-facet", collapse: true},
	{label: "Social class", field: "socialClass_ss", type: "list-facet", collapse: true},
	{label: "Education", field: "education_ss", type: "list-facet", collapse: true},
	{label: "Religion/ideology", field: "religion_ss", type: "list-facet", collapse: true},
	{label: "Profession and other activities", field: "profession_ss", type: "list-facet", collapse: true},
	{label: "Financial aspects", field: "financialSituation_ss", type: "list-facet", collapse: true},
	{label: "Memberships", field: "memberships_ss", type: "list-facet", collapse: true},
	{label: "Provisional notes", field: "notes_t", type: "text", collapse: true}
];

const personSortFields = [
	{label: "Name", field: "nameSort_s"},
	{label: "Date of birth", field: "birthDate_i"},
	{label: "Modified", field: "modified_l"},
	{label: "Date of death", field: "deathDate_i"},
	{label: "Country", field: "locationSort_s"},
	{label: "Language", field: "languageSort_s"}
];

const personFilters = [
	{field: "type_s", value: "person"}
];

const personSearchClient = new SolrClient({
	url: "/repositorysolr/wwpersons",
	searchFields: personFields,
	sortFields: personSortFields,
	rows: 25,
	pageStrategy: "paginate",
	facetSort: "count",
	filters: personFilters,
	onChange: (state) => {
		setDocumentFiltersFromPersonQuery(state);
		setPersonReceptionsFiltersFromPersonQuery(state);
		store.dispatch(setAuthorPages(state));
		store.dispatch({type: "SET_PERSON_SEARCH_STATE", state: state});
	}
});

const setPersonQueryFromDocumentFilters = (field, value) =>
	personSearchClient.setSearchFieldValue(field.replace(/\{.+\}person_/, ""), value);

const setPersonQueryFromPersonReceptionFilters = (field, value) =>
	personSearchClient.setSearchFieldValue(field.replace(/^person_/, ""), value);


export { setPersonQueryFromDocumentFilters, setPersonQueryFromPersonReceptionFilters };

export default personSearchClient;