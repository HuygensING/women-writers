// TODO change persons to authors and documents to publications

import Router from "ampersand-router";
import React from "react";

import App from "./components/app";



let AppRouter = Router.extend({
	initialize: function() {
		this.state = {
			visibleHandler: null
		};

		this.on("route", this.updateState);
	},

	updatePath() {
		let types = {
			author: "persons",
			publication: "documents"
		};

		let id = this.state[this.state.visibleHandler].id;
		let type = types[this.state.visibleHandler];

		let path = `${type}/${id}`;

		if (this.state[this.state.visibleHandler].tab) {
			path += "/" + this.state[this.state.visibleHandler].tab;
		}

		if (this.state[this.state.visibleHandler].edit) {
			path += "/edit";
		}

		this.navigate(path);
	},

	handleCancelEdit() {
		let nextState = {
			[this.state.visibleHandler]: {...this.state[this.state.visibleHandler],
				edit: false
			}
		};

		this.createNextState(nextState);
		this.updatePath();
		this.renderApp();
	},

	handleEdit() {
		let nextState = {
			[this.state.visibleHandler]: {...this.state[this.state.visibleHandler],
				edit: true
			}
		};

		this.createNextState(nextState);
		this.updatePath();
		this.renderApp();
	},

	handleTabChange(label) {
		let nextState = {
			[this.state.visibleHandler]: {...this.state[this.state.visibleHandler],
				tab: label.toLowerCase()
			}
		};

		this.createNextState(nextState);
		this.updatePath();
		this.renderApp();
	},

	updateState(handler, props) {
		let nextPageProps = {
			visible: true
		};

		if (handler === "editAuthor" || handler === "editPublication") {
			handler = handler.substr(4).toLowerCase();
			nextPageProps.edit = true;
		}

		if (props.length) {
			nextPageProps.id = (props[0] === "new") ? null : props[0];

			if (props[1] != null) {
				nextPageProps.tab = props[1];
			}
		}

		let nextState = {
			visibleHandler: handler,
			[handler]: {...this.state[handler], ...nextPageProps}
		};

		// Set the current visible component to visible is false
		// in the next state.
		if (this.state.visibleHandler != null && this.state.visibleHandler !== handler) {
			if (!nextState.hasOwnProperty(this.state.visibleHandler)) {
				nextState[this.state.visibleHandler] = {};
			}

			nextState[this.state.visibleHandler].visible = false;
		}

		this.createNextState(nextState);
		this.renderApp();
	},

	createNextState(nextState) {
		this.state = {...this.state, ...nextState};
	},

	renderApp() {
		React.render(
			<App
				{...this.state}
				onCancelEdit={this.handleCancelEdit.bind(this)}
				onEdit={this.handleEdit.bind(this)}
				onNavigate={this.navigate.bind(this)}
				onTabChange={this.handleTabChange.bind(this)} />,
			document.body
		);
	},

	routes: {
		"": "searchAuthors",
		"not-found": "notFound",
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

	searchAuthors: function() {},
	searchPublications: function() {},
	notFound: function() {},
	author: function(id, tab) {},
	editAuthor: function(id, tab) {},
	publication: function(id, tab) {},
	editPublication: function(id, tab) {}
});

export default new AppRouter();