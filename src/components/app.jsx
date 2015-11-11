import React from "react";

import MainMenu from "./main-menu";
import AuthorController from "./author";
import GraphController from "./graph";
import PublicationController from "./publication";
import CollectiveController from "./collective";

import ReceptionsController from "./receptions";
import SearchAuthors from "./search-authors";
import SearchPublications from "./search-publications";
import SearchCollectives from "./search-collectives";


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
				onNavigateNextPage={this.props.onNavigateNextAuthorPage}
				onRefresh={this.props.onAuthorRefresh.bind(this, this.props.authors.current._id)}
				onSaveAuthor={this.props.onSaveAuthor}
				onSelectVariation={this.props.onSelectAuthorVariation}
				onTabChange={this.props.onTabChange}
				onToggleEdit={this.props.onToggleEdit}
				relations={this.props.relations}
				requesting={this.props.authors.requesting}
				results={this.props.authors.results}
				showVariation={this.props.authors.showVariation}
				tab={this.props.router.author.tab}
				user={this.props.user}
				variationData={this.props.authors.variationData}
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
				onNavigateNextPage={this.props.onNavigateNextPublicationPage}
				onRefresh={this.props.onPublicationRefresh.bind(this, this.props.publications.current._id)}
				onSavePublication={this.props.onSavePublication}
				onSelectVariation={this.props.onSelectPublicationVariation}
				onTabChange={this.props.onTabChange}
				onToggleEdit={this.props.onToggleEdit}
				publication={this.props.publications.current}
				relations={this.props.relations}
				requesting={this.props.publications.requesting}
				results={this.props.publications.results}
				showVariation={this.props.publications.showVariation}
				tab={this.props.router.publication.tab}
				user={this.props.user}
				variationData={this.props.publications.variationData}
				visible={this.props.router.publication.visible} /> :
			null;

		let collective = (this.props.collectives.current !== null) ?
			<CollectiveController
				collective={this.props.collectives.current}
				edit={this.props.router.collective.edit}
				onCancel={this.props.onCancel}
				onNavigate={this.props.onNavigate}
				onNavigateNextPage={this.props.onNavigateNextCollectivePage}
				onRefresh={this.props.onCollectiveRefresh.bind(this, this.props.collectives.current._id)}
				onSaveCollective={this.props.onSaveCollective}
				onToggleEdit={this.props.onToggleEdit}
				requesting={this.props.collectives.requesting}
				results={this.props.collectives.results}
				user={this.props.user}
				visible={this.props.router.collective.visible} /> :
			null;

		let graph = (this.props.graphs.current != null) ?
			<GraphController
				data={this.props.graphs.current.data}
				id={this.props.graphs.current.id}
				onEntityClick={this.props.onGraphEntityClick}
				onNavigate={this.props.onNavigate}
				table={this.props.graphs.table}
				visible={this.props.router.graph.visible} /> : null;

		let errorMessage = this.props.errors ?
			(<div className="error-message">
				Server error {this.props.errors.statusCode}: {this.props.errors.localMessage} {this.props.errors.message ? " - " + this.props.errors.message : null}
			</div>)
			: null;

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
				{errorMessage}
				{author}
				<SearchAuthors
					onQueryChange={this.props.onAuthorSearchChange}
					onResultsChange={this.props.onAuthorResultsChange}
					onSearchId={this.props.onAuthorSearchId}
					onSelect={this.props.onResultSelect}
					query={this.props.authors.query}
					visible={this.props.router.searchAuthors.visible} />
				{publication}
				<SearchPublications
					onQueryChange={this.props.onPublicationSearchChange}
					onResultsChange={this.props.onPublicationResultsChange}
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
				<SearchCollectives
					onResultsChange={this.props.onCollectiveResultsChange}
					onSelect={this.props.onResultSelect}
					visible={this.props.router.searchCollectives.visible} />
				{collective}
			</div>
		);
	}
}

App.propTypes = {
	authors: React.PropTypes.object,
	collectives: React.PropTypes.object,
	errors: React.PropTypes.object,
	graphs: React.PropTypes.object,
	onAuthorRefresh: React.PropTypes.func,
	onAuthorResultsChange: React.PropTypes.func,
	onAuthorSearchChange: React.PropTypes.func,
	onAuthorSearchId: React.PropTypes.func,
	onCancel: React.PropTypes.func,
	onChangeAuthorKey: React.PropTypes.func,
	onChangePublicationKey: React.PropTypes.func,
	onCollectiveRefresh: React.PropTypes.func,
	onCollectiveResultsChange: React.PropTypes.func,
	onDeleteAuthor: React.PropTypes.func,
	onDeleteAuthorKey: React.PropTypes.func,
	onDeletePublication: React.PropTypes.func,
	onDeletePublicationKey: React.PropTypes.func,
	onGraphEntityClick: React.PropTypes.func,
	onLoginChange: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onNavigateNextAuthorPage: React.PropTypes.func,
	onNavigateNextCollectivePage: React.PropTypes.func,
	onNavigateNextPublicationPage: React.PropTypes.func,
	onNewAuthor: React.PropTypes.func,
	onNewPublication: React.PropTypes.func,
	onPublicationRefresh: React.PropTypes.func,
	onPublicationResultsChange: React.PropTypes.func,
	onPublicationSearchChange: React.PropTypes.func,
	onPublicationSearchId: React.PropTypes.func,
	onReceptionToggle: React.PropTypes.func,
	onResultSelect: React.PropTypes.func,
	onSaveAuthor: React.PropTypes.func,
	onSaveCollective: React.PropTypes.func,
	onSavePublication: React.PropTypes.func,
	onSelectAuthorVariation: React.PropTypes.func,
	onSelectPublicationVariation: React.PropTypes.func,
	onShowAuthorReceptions: React.PropTypes.func,
	onShowPublicationReceptions: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	onUnsetAuthorFacetValue: React.PropTypes.func,
	onUnsetAuthorFullTextField: React.PropTypes.func,
	onUnsetPublicationFacetValue: React.PropTypes.func,
	onUnsetPublicationFullTextField: React.PropTypes.func,
	publications: React.PropTypes.object,
	receptions: React.PropTypes.object,
	relations: React.PropTypes.object,
	router: React.PropTypes.object,
	user: React.PropTypes.object
};

export default App;