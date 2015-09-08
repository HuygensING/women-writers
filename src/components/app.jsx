import React from "react";

import MainMenu from "./main-menu";
import AuthorController from "./author";
import PublicationController from "./publication";
import SearchAuthors from "./search-authors";
import SearchPublications from "./search-publications";

import {setUser} from "../actions/user";
import {fetchPublication} from "../actions/publication";
import {fetchAuthor, authorSetKey, authorDeleteKey, deleteAuthor, saveAuthor} from "../actions/author";
import {fetchRelations} from "../actions/relations";

import {createStore, applyMiddleware} from "redux";
import reducers from "../reducers";
import thunkMiddleware from "redux-thunk";

const logger = store => next => action => {
	if (action.hasOwnProperty("type")) {
		console.log("[REDUX]", action.type, action);
	}

  return next(action);
};

let createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.handleResultSelect = this.handleResultSelect.bind(this);

		this.store = createStoreWithMiddleware(reducers);

		this.store.dispatch(fetchRelations());

		this.state = this.store.getState();
	}

	componentDidMount() {
		this.unsubscribe = this.store.subscribe(() =>
			this.setState(this.store.getState())
		);

		this.triggerActions(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.triggerActions(nextProps);
	}

	triggerActions(props) {
		if (props.author.id != null && props.author.visible) {
			this.store.dispatch(fetchAuthor(props.author.id));
		}

		if (props.publication.id != null && props.publication.visible) {
			this.store.dispatch(fetchPublication(props.publication.id));
		}
	}

	handleResultSelect(item) {
		let path = item.path.replace("domain/ww", "");
		this.props.onNavigate(path);
	}

	render() {
		let author = (this.state.authors.current != null) ?
			<AuthorController
				author={this.state.authors.current}
				edit={this.props.author.edit}
				id={this.props.author.id}
				onCancelEdit={this.props.onCancelEdit}
				onDeleteAuthor={() =>
					this.store.dispatch(deleteAuthor())
				}
				onEdit={this.props.onEdit}
				onFormChange={(key, value) =>
					this.store.dispatch(authorSetKey(key, value))
				}
				onFormDelete={(key, value) =>
					this.store.dispatch(authorDeleteKey(key))
				}
				onSaveAuthor={() =>
					this.store.dispatch(saveAuthor())
				}
				onTabChange={this.props.onTabChange}
				relations={this.state.relations}
				tab={this.props.author.tab}
				user={this.state.user}
				visible={this.props.author.visible} /> :
			null;

		let publication = (this.state.publications.current != null) ?
			<PublicationController
				edit={this.props.publication.edit}
				id={this.props.publication.id}
				onCancelEdit={this.props.onCancelEdit}
				onEdit={this.props.onEdit}
				onTabChange={this.props.onTabChange}
				publication={this.state.publications.current}
				relations={this.state.relations}
				tab={this.props.publication.tab}
				user={this.state.user}
				visible={this.props.publication.visible} /> :
			null;

		return (
			<div className="app">
				<header>
					<h1>NEWW Women Writers</h1>
					<MainMenu
						onLoginChange={(response) =>
							this.store.dispatch(setUser(response))
						}
						onNewAuthor={() =>
							this.props.onNavigate("/persons/new")
						}
						onNewPublication={() =>
							this.props.onNavigate("/documents/new")
						}
					/>
				</header>
				{author}
				<SearchAuthors
					onSelect={this.handleResultSelect}
					visible={this.props.searchAuthors.visible} />
				{publication}
				<SearchPublications
					onSelect={this.handleResultSelect}
					visible={this.props.searchPublications.visible} />
			</div>
		);
	}
}

App.propTypes = {
	author: React.PropTypes.object,
	onNavigate: React.PropTypes.func,
	publication: React.PropTypes.object,
	searchAuthors: React.PropTypes.object,
	searchPublications: React.PropTypes.object
};

App.defaultProps = {
	author: {
		visible: false
	},
	searchAuthors: {
		visible: false
	},
	publication: {
		visible: false
	},
	searchPublications: {
		visible: false
	}
};


export default App;