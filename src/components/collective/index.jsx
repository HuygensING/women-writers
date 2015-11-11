import React from "react";
import Link from "../link";
import EditButton from "../edit-button";
import EditFooter from "../save-footer";
import PaginationLinks from "../links/pagination";
import cx from "classnames";


class CollectiveController extends React.Component {

	render() {
		let resultsLink = <Link className="pagination-link" href="/collectives" onNavigate={this.props.onNavigate} value="◂ Results" />;
		let paginationLinks = this.props.collective._id ?
			<PaginationLinks
				href="/collectives/"
				id={this.props.collective._id}
				onNavigate={this.props.onNavigate}
				onNavigateNextPage={this.props.onNavigateNextPage}
				results={this.props.results} /> :
			null;

		let links = this.props.collective.links.length ?
			this.props.collective.links.map((l, i) => <li key={i}><a className="link" href={l.url} target="_blank">{l.label}</a></li>) :
			"-";

		let storageDocuments = this.props.collective["@relations"].isStorageOf ? (
			<li>
				<label>Is storage of</label>
				<span><ul className="relation">
					{this.props.collective["@relations"].isStorageOf.map((r, i) => (
						<li key={i}><Link href={"documents/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
					))}
				</ul></span>
			</li>) : <li><label>Is storage of</label>-</li>;

		let publishedDocuments = this.props.collective["@relations"].isPublisherOf ? (
			<li>
				<label>Is publisher of</label>
				<span><ul className="relation">
					{this.props.collective["@relations"].isPublisherOf.map((r, i) => (
						<li key={i}><Link href={"documents/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
					))}
				</ul></span>
			</li>) : <li><label>Is publisher of</label>-</li>;


		let members = this.props.collective["@relations"].hasMember ? (
			<li>
				<label>Has members</label>
				<span><ul className="relation">
					{this.props.collective["@relations"].hasMember.map((r, i) => (
						<li key={i}><Link href={"persons/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
					))}
				</ul></span>
			</li>) : <li><label>Has members</label>-</li>;

		let pid = this.props.collective["^pid"] ?
			<a className="link" href={this.props.collective["^pid"]} target="_blank">{this.props.collective["^pid"]}</a> : "-";

		let editButton = (this.props.edit && this.props.user && this.props.user.token) ?
			null :
			<EditButton
				model={this.props.collective}
				onRefresh={this.props.onRefresh}
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let footer = (this.props.edit && this.props.user && this.props.user.token) ?
			<EditFooter
				onCancel={this.props.onCancel.bind(this, "collective")}
				onDelete={this.props.onDeleteCollective}
				onSave={this.props.onSaveCollective}
				type="collective" /> :
			null;

		return (
			<div
				className={cx(
					"collective",
					{requesting: this.props.requesting},
					{visible: this.props.visible}
				)}>
				{resultsLink}
				<header className="page"><h2>{this.props.collective.name}</h2></header>
				{paginationLinks}
				<div className="extra-info">
					{editButton}
				</div>
				<div className="record-container">
					<ul className="record">
						<li>
							<label>Name</label>
							{this.props.collective.name}
						</li>
						<li>
							<label>Type</label>
							{this.props.collective.type}
						</li>
						<li>
							<label>Persistent ID</label>
							{pid}
						</li>
						<li>
							<label>Has location</label>
							{(this.props.collective["@relations"].hasLocation || []).map((r) => r.displayName).join(", ")}
						</li>
						<li>
							<label>Links</label>
							<span><ul className="relation">{links}</ul></span>
						</li>
						{storageDocuments}
						{publishedDocuments}
						{members}
					</ul>
				</div>
				{footer}
			</div>
		);
	}
}

CollectiveController.propTypes = {
	collective: React.PropTypes.object,
	edit: React.PropTypes.bool,
	onCancel: React.PropTypes.func,
	onDeleteCollective: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onNavigateNextPage: React.PropTypes.func,
	onRefresh: React.PropTypes.func,
	onSaveCollective: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	requesting: React.PropTypes.bool,
	results: React.PropTypes.object,
	user: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default CollectiveController;
