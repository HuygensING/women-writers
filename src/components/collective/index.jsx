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

		let documents = this.props.collective["@relations"].isStorageOf ?
			this.props.collective["@relations"].isStorageOf.map((r, i) => (
				<li key={i}><Link href={"documents/" + r.id} onNavigate={this.props.onNavigate} value={r.displayName} /></li>
			)) : "-";

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
							<label>Has location</label>
							{(this.props.collective["@relations"].hasLocation || []).map((r) => r.displayName).join(", ")}
						</li>
						<li>
							<label>Links</label>
							<ul className="relation">{links}</ul>
						</li>
						<li>
							<label>Is storage of</label>
							<ul className="relation">{documents}</ul>
						</li>
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
