import React from "react";
import store from "./reducers/store";
import { Router, Route, browserHistory } from "react-router";
import { Provider, connect } from "react-redux";
import App from "./components/app";
import actions from "./actions";

import AuthorSearch from "./components/search/authors";
import PublicationSearch from "./components/search/publications";
import AuthorReceptionSearch from "./components/search/author-receptions";
import PublicationReceptionSearch from "./components/search/publication-receptions";
import ModifiedSearch from "./components/search/modified";

import AuthorIndex from "./components/authors/author-index";
import AuthorTabs from "./components/authors/tabs";
import AuthorEditTabs from "./components/authors/edit-tabs";

import PublicationIndex from "./components/publications/publication-index";
import PublicationTabs from "./components/publications/tabs";
import PublicationEditTabs from "./components/publications/edit-tabs";

import CollectiveSearch from "./components/search/collectives";
import CollectiveIndex from "./components/collectives/collective-index";

import D3Graph from "./components/d3-graph/d3-graph";

const grabQuery = (search) => ({
	searchFields: search.query.searchFields.filter((sf) => sf.value && sf.value.length),
	sortFields: search.query.sortFields.filter((sf) => sf.value && sf.value.length)
});

export function serializeSearch() {
	const { personSearch, documentSearch, personReceptionSearch, documentReceptionSearch } = store.getState();

	return encodeURIComponent(JSON.stringify({
		authors: grabQuery(personSearch),
		publications: grabQuery(documentSearch),
		authorReceptions: grabQuery(personReceptionSearch),
		publicationReceptions: grabQuery(documentReceptionSearch)
	}));
}


const urls = {
	root: (useBase = false) => useBase ?
		"/womenwriters/vre" :
		`/womenwriters/vre#q=${serializeSearch()}`,

	authorSearch: (useBase = false) => useBase ?
		"/womenwriters/vre/persons" :
		`/womenwriters/vre/persons#q=${serializeSearch()}`,

	publicationSearch: (useBase = false) => useBase ?
		"/womenwriters/vre/documents" :
		`/womenwriters/vre/documents#q=${serializeSearch()}`,

	authorReceptionSearch: (useBase = false) => useBase ?
		"/womenwriters/vre/receptions/authors" :
		`/womenwriters/vre/receptions/authors#q=${serializeSearch()}`,

	publicationReceptionSearch: (useBase = false) => useBase ?
		"/womenwriters/vre/receptions/publications" :
		`/womenwriters/vre/receptions/publications#q=${serializeSearch()}`,

	collectiveSearch: () => "/womenwriters/vre/collectives",

	modifiedSearch: () => "/womenwriters/vre/modified",

	authorIndex: (id = null) => id ?
		`/womenwriters/vre/persons/${id}`
		: "/womenwriters/vre/persons/:id",

	authorTab: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/persons/${id}/${tab}` : id ?
		`/womenwriters/vre/persons/${id}` : "/womenwriters/vre/persons/:id/:tab",

	authorEdit: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/persons/${id}/${tab}/edit`
		: "/womenwriters/vre/persons/:id/:tab/edit",

	authorNew: () => "/womenwriters/vre/persons/new",

	publicationIndex: (id = null) => id ?
		`/womenwriters/vre/documents/${id}`
		: "/womenwriters/vre/documents/:id",

	publicationTab: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/documents/${id}/${tab}` : id ?
		`/womenwriters/vre/documents/${id}` : "/womenwriters/vre/documents/:id/:tab",

	publicationEdit: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/documents/${id}/${tab}/edit`
		: "/womenwriters/vre/documents/:id/:tab/edit",

	publicationNew: () => "/womenwriters/vre/documents/new",

	publicationReceptionIndex: (id = null) => id ?
		`/womenwriters/vre/receptions/publications/${id}`
		: "/womenwriters/vre/receptions/publications/:id",

	publicationReceptionTab: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/receptions/publications/${id}/${tab}` : id ?
		`/womenwriters/vre/receptions/publications/${id}` : "/womenwriters/vre/receptions/publications/:id/:tab",

	publicationReceptionEdit: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/receptions/publications/${id}/${tab}/edit`
		: "/womenwriters/vre/receptions/publications/:id/:tab/edit",

	authorReceptionIndex: (id = null) => id ?
		`/womenwriters/vre/receptions/authors/${id}`
		: "/womenwriters/vre/receptions/authors/:id",

	authorReceptionTab: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/receptions/authors/${id}/${tab}` : id ?
		`/womenwriters/vre/receptions/authors/${id}` : "/womenwriters/vre/receptions/authors/:id/:tab",

	authorReceptionEdit: (id = null, tab = null) => id && tab ?
		`/womenwriters/vre/receptions/authors/${id}/${tab}/edit`
		: "/womenwriters/vre/receptions/authors/:id/:tab/edit",

	collectiveNew: () => "/womenwriters/vre/collectives/new",

	collectiveIndex: (id = null) => id ?
		`/womenwriters/vre/collectives/${id}`
		: "/womenwriters/vre/collectives/:id",

	collectiveEdit: (id = null) => id ?
		`/womenwriters/vre/collectives/${id}/edit`
		: "/womenwriters/vre/collectives/:id/edit",

	graph: (collection, id) => id && collection ?
		`/womenwriters/vre/graph/${collection}/${id}`
		: "/womenwriters/vre/graph/:collection/:id"
};

const filterAuthorized = (redirectTo) => (nextState, replace) => {
	if (!localStorage.getItem("WomenWriters-auth-token")) {
		replace(redirectTo);
	}
};

export { urls };

export function navigateTo(key, args) {
	browserHistory.push(urls[key].apply(null, args));
}

const makeContainerComponent = connect((state) => state, (dispatch) => actions(navigateTo, dispatch));

const router = (
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path={urls.root(true)} component={makeContainerComponent(App)}>
				<Route path={urls.authorSearch(true)} component={makeContainerComponent(AuthorSearch)} />
				<Route path={urls.publicationSearch(true)} component={makeContainerComponent(PublicationSearch)} />
				<Route path={urls.authorReceptionSearch(true)} component={makeContainerComponent(AuthorReceptionSearch)} />
				<Route path={urls.publicationReceptionSearch(true)} component={makeContainerComponent(PublicationReceptionSearch)} />
				<Route path={urls.collectiveSearch()} component={makeContainerComponent(CollectiveSearch)} onEnter={filterAuthorized(urls.authorSearch())} />
				<Route path={urls.modifiedSearch()} component={makeContainerComponent(ModifiedSearch)} onEnter={filterAuthorized(urls.authorSearch())} />


				<Route path={urls.authorNew()} component={makeContainerComponent(AuthorIndex)} />
				<Route path={urls.authorIndex()} component={makeContainerComponent(AuthorIndex)}>
					<Route path={urls.authorTab()} component={makeContainerComponent(AuthorTabs)}>
						<Route path={urls.authorEdit()} component={makeContainerComponent(AuthorEditTabs)} />
					</Route>
				</Route>

				<Route path={urls.publicationNew()} component={makeContainerComponent(PublicationIndex)} />
				<Route path={urls.publicationIndex()} component={makeContainerComponent(PublicationIndex)}>
					<Route path={urls.publicationTab()} component={makeContainerComponent(PublicationTabs)}>
						<Route path={urls.publicationEdit()} component={makeContainerComponent(PublicationEditTabs)} />
					</Route>
				</Route>

				<Route path={urls.publicationReceptionIndex()} component={makeContainerComponent(PublicationIndex)}>
					<Route path={urls.publicationReceptionTab()} component={makeContainerComponent(PublicationTabs)}>
						<Route path={urls.publicationReceptionEdit()} component={makeContainerComponent(PublicationEditTabs)} />
					</Route>
				</Route>

				<Route path={urls.authorReceptionIndex()} component={makeContainerComponent(PublicationIndex)}>
					<Route path={urls.authorReceptionTab()} component={makeContainerComponent(PublicationTabs)}>
						<Route path={urls.authorReceptionEdit()} component={makeContainerComponent(PublicationEditTabs)} />
					</Route>
				</Route>

				<Route path={urls.collectiveNew()} component={makeContainerComponent(CollectiveIndex)} />
				<Route path={urls.collectiveIndex()} component={makeContainerComponent(CollectiveIndex)} />
				<Route path={urls.collectiveEdit()} component={makeContainerComponent(CollectiveIndex)} />

				<Route path={urls.graph()} component={makeContainerComponent(D3Graph)} />
			</Route>
		</Router>
	</Provider>
);

export default router;