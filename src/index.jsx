// VENDOR
import Router from "ampersand-router";
import React from "react";

// STORE
import store from "./store";

// ACTIONS
import {changeRoute, toggleEdit, changeTab} from "./actions/router";
import {setUser} from "./actions/user";
import {setAuthorKey, deleteAuthorKey, deleteAuthor, saveAuthor, setAuthorQueryFromPublicationQuery} from "./actions/author";
import {setPublicationKey, deletePublicationKey, deletePublication, savePublication, setPublicationQueryFromAuthorQuery} from "./actions/publication";
import {setPendingSearchId, setSearchId} from "./actions/receptions";
import {fetchRelations} from "./actions/relations";
import {fetchGraphTable} from "./actions/graph";

// COMPONENTS
import App from "./components/app";

const rootPath = "/womenwriters/";

let AppRouter = Router.extend({
	initialize: function() {
		// Subscribe to the store. On every store change,
		// render the app and adjust the location path.
		store.subscribe(() => {
			let state = store.getState();

			this.renderApp(state);

			if (this.history.location.pathname.substr(rootPath.length) !== state.router.path) {
				this.navigate(state.router.path);
			}
		});

		// When a new route is triggered, update the
		// store with the new route.
		this.on("route", (handler, props) =>
			store.dispatch(changeRoute(handler, props))
		);

		store.dispatch(fetchRelations());
	},

	renderApp(nextState) {
		React.render(
			<App
				{...nextState}
				onAuthorResultsChange={(results) =>
					store.dispatch({type: "SET_AUTHOR_FACETS", activeFacets: results.facets})
				}
				onAuthorSearchChange={(results, query) => {
					store.dispatch(setPublicationQueryFromAuthorQuery(query));
					store.dispatch({type: "SET_AUTHOR_QUERY", query: query});
				}}
				onAuthorSearchId={(searchId) => {
					store.dispatch(setPendingSearchId(searchId, "author"));
				}}
				onChangeAuthorKey={(key, value) =>
					store.dispatch(setAuthorKey(key, value))
				}
				onChangePublicationKey={(key, value) =>
					store.dispatch(setPublicationKey(key, value))
				}
				onDeleteAuthor={() =>
					store.dispatch(deleteAuthor())
				}
				onDeleteAuthorKey={(key) =>
					store.dispatch(deleteAuthorKey(key))
				}
				onDeletePublication={() =>
					store.dispatch(deletePublication())
				}
				onDeletePublicationKey={(key) =>
					store.dispatch(deletePublicationKey(key))
				}
				onGraphEntityClick={(obj) =>
					store.dispatch(fetchGraphTable(...obj.key.split("/")))
				}
				onLoginChange={(response) =>
					store.dispatch(setUser(response))
				}
				onNavigate={this.navigate.bind(this)}
				onNewAuthor={() =>
					this.navigate("/persons/new")
				}
				onNewPublication={() =>
					this.navigate("/documents/new")
				}
				onPublicationResultsChange={(results) =>
					store.dispatch({type: "SET_PUBLICATION_FACETS", activeFacets: results.facets})
				}
				onPublicationSearchChange={(results, query) => {
					store.dispatch(setAuthorQueryFromPublicationQuery(query));
					store.dispatch({type: "SET_PUBLICATION_QUERY", query: query});
				}}
				onPublicationSearchId={(searchId) => {
					store.dispatch(setPendingSearchId(searchId, "publication"));
				}}
				onReceptionToggle={(tab) =>
					this.navigate("/receptions/" + tab.toLowerCase())
				}
				onResultSelect={(item) =>
					this.navigate(item.path.replace("domain/ww", ""))
				}
				onSaveAuthor={() =>
					store.dispatch(saveAuthor())
				}
				onSavePublication={() =>
					store.dispatch(savePublication())
				}
				onShowAuthorReceptions={(searchId) =>
					store.dispatch(setSearchId(searchId, "author"))
				}
				onShowPublicationReceptions={(searchId) =>
					store.dispatch(setSearchId(searchId, "publication"))
				}
				onTabChange={(label) =>
					store.dispatch(changeTab(label))
				}
				onToggleEdit={(edit) =>
					store.dispatch(toggleEdit(edit))
				} />,
			document.body
		);
	},

	routes: {
		"": "searchAuthors",
		"not-found": "notFound",
		"persons(/)": "searchAuthors",
		"documents(/)": "searchPublications",
		// "persons/new": "editAuthor",
		"persons/:id/edit": "editAuthor",
		"persons/:id/:tab/edit": "editAuthor",
		"persons/:id/:tab": "author",
		"persons/:id": "author",
		// "documents/new": "editPublication",
		"documents/:id/edit": "editPublication",
		"documents/:id/:tab/edit": "editPublication",
		"documents/:id/:tab": "publication",
		"documents/:id": "publication",
		"graph/:domain/:id": "graph",
		"receptions/:tab": "receptions"
	},

	searchAuthors: function() {},
	searchPublications: function() {},
	notFound: function() {},
	author: function(id, tab) {},
	editAuthor: function(id, tab) {},
	publication: function(id, tab) {},
	editPublication: function(id, tab) {},
	graph: function(domain, id) {},
	receptions: function() {}
});

document.addEventListener("DOMContentLoaded", () =>
	new AppRouter().history.start({
		root: rootPath
	})
);