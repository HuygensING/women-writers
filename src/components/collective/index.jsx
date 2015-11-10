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
