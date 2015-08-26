// TODO change persons to authors and documents to publications

import Router from "ampersand-router";
import React from "react";

import FacetedSearch from "hire-faceted-search";
import facetedSearchConfig from "./fs-config";

import Author from "./components/author";
import AuthorForm from "./components/author-form";

import Publication from "./components/publication";
import PublicationForm from "./components/publication-form";



let R = Router.extend({
	routes: {
		"": "searchAuthors",
		"persons(/)": "searchAuthors",
		"documents(/)": "searchPublications",
		"persons/new": "editAuthor",
		"persons/:id/edit": "editAuthor",
		"persons/:id/:tab/edit": "editAuthor",
		"persons/:id/:tab": "author",
		"persons/:id": "author",
		"documents/new": "editPublication",
		"documents/:id/edit": "editPublication",
		"documents/:id/:tab/edit": "editPublication",
		"documents/:id/:tab": "publication",
		"documents/:id": "publication"
	},

	initialize() {
		let prevHandlerName = null;

		let appEl = document.querySelector(".app");
		let searchAuthorsEl = document.querySelector(".search-authors");
		let searchPublicationsEl = document.querySelector(".search-publications");

		this.on("route", (handlerName) => {
			if (prevHandlerName === "searchAuthors" && handlerName === "author") {
				searchAuthorsEl.classList.add("middle-to-left");
				appEl.classList.add("right-to-left");
			}
		});

	},

	searchAuthors: function() {
		React.render(
			<FacetedSearch
				config={{
					baseURL: "https://acc.repository.huygens.knaw.nl/v2",
					searchPath: "/search/wwpersons",
					levels: [],
					headers: {VRE_ID: "WomenWriters"}
				}}
				facetList={[
					"dynamic_s_gender",
					"dynamic_s_residence",
					"dynamic_s_language",
					"dynamic_s_birthDate",
					"dynamic_s_birthplace",
					"dynamic_s_deathDate",
					"dynamic_s_deathplace",
					"dynamic_s_religion",
					"dynamic_s_collective"
				]}
				labels={{
					facetTitles: {
						"dynamic_s_deathplace": "Place of Death",
						"dynamic_s_birthplace": "Place of birth",
						"dynamic_s_gender": "Gender",
						"dynamic_s_residence": "Country of residence",
						"dynamic_s_relatedLocations": "Related country",
						"dynamic_s_religion": "Religion",
						"dynamic_s_language": "Language",
						"dynamic_s_deathDate": "Year of Death",
						"dynamic_s_birthDate": "Year of birth",
						"dynamic_s_collective": "Memberships",
						"dynamic_sort_name": "Name",
						"dynamic_k_birthDate": "Date of Birth",
						"dynamic_k_deathDate": "Date of Death",
						"gender": "Gender",
						"birthDate": "Date of birth",
						"deathDate": "Date of death",
						"name": "Name",
						"residenceLocation": "Country of residence"
					}
				}}
				metadataList={[
					"name",
					"birthDate",
					"deathDate",
					"residenceLocation"
				]}
				onChange={(results, query) => console.log({RESULTS: results, QUERY: query})}
				onSelect={(item) =>
					this.navigate(`/persons/${item.id}`)
				} />,
			document.querySelector(".search-authors")
		);
	},

	searchPublications: function() {
		React.render(
			<FacetedSearch
				config={{
					baseURL: "https://acc.repository.huygens.knaw.nl/v2",
					searchPath: "/search/wwdocuments",
					levels: ["dynamic_sort_creator", "dynamic_sort_title"],
					headers: {VRE_ID: "WomenWriters"}
				}}
				facetList={[
					"dynamic_s_creator",
					"dynamic_s_origin",
					"dynamic_s_language",
					"dynamic_s_genre"
				]}
				labels={{
					facetTitles: {
						"dynamic_s_creator": "Author",
						"dynamic_sort_creator": "Author",
						"dynamic_sort_title": "Title",
						"dynamic_s_origin": "Country of first publication",
						"dynamic_s_genre": "Genre",
						"dynamic_s_language": "Language",
						"createdBy": "Author",
						"language": "Language",
						"publishLocation": "Country of first publication",
						"date": "Date"
					}
				}}
				metadataList={[
					"createdBy",
					"publishLocation",
					"language",
					"date"
				]}
				onChange={(results, query) => console.log({RESULTS: results, QUERY: query})}
				onSelect={(item) =>
					this.navigate(`/documents/${item.id}`)
				} />,
			document.querySelector(".search-publications")
		);
	},

	author: function(id, tab) {
		if (id === "new") {
			id = null;
		}

		React.render(<Author id={id} tab={tab} />, document.querySelector(".app"));
	},

	editAuthor: function(id, tab) {
		if (id === "new") {
			id = null;
		}

		React.render(<AuthorForm id={id} tab={tab} />, document.querySelector(".app"));
	},

	publication: function(id, tab) {
		if (id === "new") {
			id = null;
		}

		React.render(<Publication id={id} tab={tab} />, document.querySelector(".app"));
	},

	editPublication: function(id, tab) {
		if (id === "new") {
			id = null;
		}

		React.render(<PublicationForm id={id} tab={tab} />, document.querySelector(".app"));
	}
});

export default new R();