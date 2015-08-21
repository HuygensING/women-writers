// TODO change persons to authors and documents to publications

import Router from "ampersand-router";
import React from "react";

import FacetedSearch from "hire-faceted-search";
import facetedSearchConfig from "./fs-config";

import Author from "./components/author";
import EditAuthor from "./components/edit-author";

import Publication from "./components/publication";
import EditPublication from "./components/edit-publication";

let i18n = {
	facetTitles: {
		Locatie: "Location",
		Datum: "Date",
		Boekjaar: "Book year",
		"Historische instelling": "Historical institute",
		"Inventaris nummer": "Nummero inventarisatio",
		"Document type": "Typico docco",
		"Folio nummer(s)": "Nummero folio",
		"Pagina nummer(s)": "Nummero pagino",
		Toegangsnummer: "Entrada nummero",
		Titel: "Titelaoe",
		Auteur: "Auteuraoe",
		"Plaats van publicatie": "Strada de publicada",
		"Jaar van publicatie": "Ano de publicada",
		"Persons mentioned": "Hablero de personas",
		"Genoemde personen": "Nom de personas",
		"Personas Mencionadas": "Personas Mencionadas",
		Themes: "Thematicos",
		Temas: "Thematicosas",
		"Thema's": "Pequeno thematicosas"
	},
	"Results found": "Resultas buscario",
	"Sort by": "Sortas y"
};

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

	handleClick() {
		console.log("BIND");
	},

	searchPersons: function() {
		let facetedSearch = (
			<FacetedSearch
				config={facetedSearchConfig}
				i18n={i18n}
				onChange={(item) => console.log(item)} />);

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