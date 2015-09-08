import React from "react";

import MainMenu from "./main-menu";
import AuthorController from "./author";
import PublicationController from "./publication";
import SearchAuthors from "./search-authors";
import SearchPublications from "./search-publications";

class App extends React.Component {
	render() {
		let author = (this.props.authors.current != null) ?
			<AuthorController
				author={this.props.authors.current}
				edit={this.props.router.author.edit}
				onDeleteAuthor={this.props.onDeleteAuthor}
				onFormChange={this.props.onChangeAuthorKey}
				onFormDelete={this.props.onDeleteAuthorKey}
				onSaveAuthor={this.props.onSaveAuthor}
				onTabChange={this.props.onTabChange}
				onToggleEdit={this.props.onToggleEdit}
				relations={this.props.relations}
				tab={this.props.router.author.tab}
				user={this.props.user}
				visible={this.props.router.author.visible} /> :
			null;

		let publication = (this.props.publications.current != null) ?
			<PublicationController
				edit={this.props.router.publication.edit}
				onDeletePublication={this.props.onDeletePublication}
				onFormChange={this.props.onChangePublicationKey}
				onFormDelete={this.props.onDeletePublicationKey}
				onSavePublication={this.props.onSavePublication}
				onTabChange={this.props.onTabChange}
				onToggleEdit={this.props.onToggleEdit}
				publication={this.props.publications.current}
				relations={this.props.relations}
				tab={this.props.router.publication.tab}
				user={this.props.user}
				visible={this.props.router.publication.visible} /> :
			null;

		return (
			<div className="app">
				<header>
					<h1>NEWW Women Writers</h1>
					<MainMenu
						onLoginChange={this.props.onLoginChange}
						onNewAuthor={this.props.onNewAuthor}
						onNewPublication={this.props.onNewPublication}
					/>
				</header>
				{author}
				<SearchAuthors
					onSelect={this.props.onResultSelect}
					visible={this.props.router.searchAuthors.visible} />
				{publication}
				<SearchPublications
					onSelect={this.props.onResultSelect}
					visible={this.props.router.searchPublications.visible} />
			</div>
		);
	}
}

App.propTypes = {
	// author: React.PropTypes.object,
	onNavigate: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	// publication: React.PropTypes.object,
	// searchAuthors: React.PropTypes.object,
	// searchPublications: React.PropTypes.object
};

export default App;