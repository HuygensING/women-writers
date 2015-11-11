import React from "react";
import Link from "../link";
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
			</li>) : null;

		let publishedDocuments = this.props.collective["@relations"].isPublisherOf ? (
			<li>
				<label>Is publisher of</label>
				<span><ul className="relation">
					{this.props.collective["@relations"].isPublisherOf.map((r, i) => (
						<li key={i}><Link href={"documents/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
					))}
				</ul></span>
			</li>) : null;


		let members = this.props.collective["@relations"].hasMember ? (
			<li>
				<label>Has members</label>
				<span><ul className="relation">
					{this.props.collective["@relations"].hasMember.map((r, i) => (
						<li key={i}><Link href={"persons/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
					))}
				</ul></span>
			</li>) : null;

		let pid = this.props.collective["^pid"] ?
			<a className="link" href={this.props.collective["^pid"]} target="_blank">{this.props.collective["^pid"]}</a> : "-";

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
			</div>
		);
	}
}

CollectiveController.propTypes = {
	collective: React.PropTypes.object,
	onNavigate: React.PropTypes.func,
	onNavigateNextPage: React.PropTypes.func,
	requesting: React.PropTypes.bool,
	results: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default CollectiveController;
