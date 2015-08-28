// TODO change persons to authors and documents to publications

import Router from "ampersand-router";
import React from "react";

import App from "./components/app";
import SearchAuthors from "./components/search-authors";
import SearchPublications from "./components/search-publications";

let showPage = function(page) {
	[".search-authors", ".search-publications", ".app"].forEach((pageClass) =>
		document.querySelector(pageClass).style.display = (page === pageClass) ? "block" : "none"
	);
};

let appRender = function(name, edit, id, tab) {
	React.render(
		<App
			edit={edit}
			id={id}
			page={name}
			tab={tab} />,
		document.querySelector(".app")
	);

	showPage(".app");
};

let R = Router.extend({
	routes: {
		"": "searchAuthors",
		"persons(/)": "searchAuthors",
		"documents(/)": "searchPublications",
		"persons/new": appRender.bind(this, "author", true),
		"persons/:id/edit": appRender.bind(this, "author", true),
		"persons/:id/:tab/edit": appRender.bind(this, "author", true),
		"persons/:id/:tab": appRender.bind(this, "author"), false,
		"persons/:id": appRender.bind(this, "author", false),
		"documents/new": appRender.bind(this, "publication", true),
		"documents/:id/edit": appRender.bind(this, "publication", true),
		"documents/:id/:tab/edit": appRender.bind(this, "publication", true),
		"documents/:id/:tab": appRender.bind(this, "publication", false),
		"documents/:id": appRender.bind(this, "publication", false)
	},

	searchAuthors: function() {
		React.render(
			<SearchAuthors
				router={this} />,
			document.querySelector(".search-authors")
		);

		showPage(".search-authors");
	},

	searchPublications: function() {
		React.render(
			<SearchPublications
				router={this} />,
			document.querySelector(".search-publications")
		);

		showPage(".search-publications");
	}
});

export default new R();