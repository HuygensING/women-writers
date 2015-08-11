// TODO change persons to authors and documents to publications

import Router from "ampersand-router";
import React from "react";

import FacetedSearch from "hire-faceted-search";

import Author from "./components/author";
import EditAuthor from "./components/edit-author";

import Publication from "./components/publication";
import EditPublication from "./components/edit-publication";

let R = Router.extend({
	routes: {
		"": "home",
		"persons": "searchPersons",
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

	home: function() {
		console.log("HOME");
	},

	searchPersons: function() {
		let facetedSearch = (
				<FacetedSearch
					onChange={function(obj){ alert(obj.name) }}
					sortFields={["Locatie", "Historische instelling", "Inventaris nummer"]} />);

		React.render(facetedSearch, document.querySelector(".app"));
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

		React.render(<EditAuthor id={id} tab={tab} />, document.querySelector(".app"));
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

		React.render(<EditPublication id={id} tab={tab} />, document.querySelector(".app"));
	}
});

export default new R();