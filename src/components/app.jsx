import React from "react";

import MainMenu from "./main-menu";
import AuthorController from "./author";
import GraphController from "./graph";
import PublicationController from "./publication";
import ReceptionsController from "./receptions";
import SearchAuthors from "./search-authors";
import SearchPublications from "./search-publications";

class App extends React.Component {
	render() {
		let author = (this.props.authors.current != null) ?
			<AuthorController
				author={this.props.authors.current}
				edit={this.props.router.author.edit}
				onCancel={this.props.onCancel}
				onDeleteAuthor={this.props.onDeleteAuthor}
				onFormChange={this.props.onChangeAuthorKey}
				onFormDelete={this.props.onDeleteAuthorKey}
				onNavigate={this.props.onNavigate}
				onRefresh={this.props.onAuthorRefresh.bind(this, this.props.authors.current._id)}
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
				onCancel={this.props.onCancel}
				onDeletePublication={this.props.onDeletePublication}
				onFormChange={this.props.onChangePublicationKey}
				onFormDelete={this.props.onDeletePublicationKey}
				onNavigate={this.props.onNavigate}
				onRefresh={this.props.onPublicationRefresh.bind(this, this.props.publications.current._id)}
				onSavePublication={this.props.onSavePublication}
				onTabChange={this.props.onTabChange}
				onToggleEdit={this.props.onToggleEdit}
				publication={this.props.publications.current}
				relations={this.props.relations}
				tab={this.props.router.publication.tab}
				user={this.props.user}
				visible={this.props.router.publication.visible} /> :
			null;

		let graph = (this.props.graphs.current != null) ?
			<GraphController
				data={this.props.graphs.current.data}
				id={this.props.graphs.current.id}
				onEntityClick={this.props.onGraphEntityClick}
				onNavigate={this.props.onNavigate}
				table={this.props.graphs.table}
				visible={this.props.router.graph.visible} /> : null;

		return (
			<div className="app">
				<header>
					<h1>NEWW Women Writers</h1>
					<MainMenu
						onLoginChange={this.props.onLoginChange}
						onNavigate={this.props.onNavigate}
						onNewAuthor={this.props.onNewAuthor}
						onNewPublication={this.props.onNewPublication}
						user={this.props.user}
					/>
				</header>
				{author}
				<SearchAuthors
					onResultsChange={this.props.onAuthorResultsChange}
					onQueryChange={this.props.onAuthorSearchChange}
					onSearchId={this.props.onAuthorSearchId}
					onSelect={this.props.onResultSelect}
					query={this.props.authors.query}
					visible={this.props.router.searchAuthors.visible} />
				{publication}
				<SearchPublications
					onResultsChange={this.props.onPublicationResultsChange}
					onQueryChange={this.props.onPublicationSearchChange}
					onSearchId={this.props.onPublicationSearchId}
					onSelect={this.props.onResultSelect}
					query={this.props.publications.query}
					visible={this.props.router.searchPublications.visible} />
				{graph}
				<ReceptionsController
					authors={this.props.authors}
					onSelect={this.props.onResultSelect}
					onShowAuthorReceptions={this.props.onShowAuthorReceptions}
					onShowPublicationReceptions={this.props.onShowPublicationReceptions}
					onTabChange={this.props.onReceptionToggle}
					onUnsetAuthorFacetValue={this.props.onUnsetAuthorFacetValue}
					onUnsetAuthorFullTextField={this.props.onUnsetAuthorFullTextField}
					onUnsetPublicationFacetValue={this.props.onUnsetPublicationFacetValue}
					onUnsetPublicationFullTextField={this.props.onUnsetPublicationFullTextField}
					publications={this.props.publications}
					receptions={this.props.receptions}
					tab={this.props.router.receptions.id}
					visible={this.props.router.receptions.visible} />
			</div>
		);
	}
}

App.propTypes = {
	// author: React.PropTypes.object,
	onAuthorSearchChange: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func
	// publication: React.PropTypes.object,
	// searchAuthors: React.PropTypes.object,
	// searchPublications: React.PropTypes.object
};

export default App;