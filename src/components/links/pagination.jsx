import React from "react";
import Link from "../link";

class PaginationLinks extends React.Component {

	render() {
		let curIndex = this.props.results.ids.indexOf(this.props.id);
		let prevLink = curIndex > 0 ?
			<Link href={this.props.href + this.props.results.ids[curIndex - 1]} onNavigate={this.props.onNavigate} value="◂ Previous" /> :
			null;

		let nextLink = curIndex > -1 && curIndex < this.props.results.ids.length - 1 ?
			<Link href={this.props.href + this.props.results.ids[curIndex + 1]} onNavigate={this.props.onNavigate} value="Next ▸" /> :
			null;

		if (this.props.results._next !== null && nextLink === null && curIndex > -1) {
			nextLink = <Link onNavigate={this.props.onNavigateNextPage.bind(this, this.props.results._next)} value="Next ▸" />;
		}
		console.log(curIndex);

		return (
			<span className="pagination-links">
				{prevLink}
				{nextLink}
			</span>
		);
	}
}

PaginationLinks.propTypes = {
	href: React.PropTypes.string,
	id: React.PropTypes.string,
	onNavigate: React.PropTypes.func,
	onNavigateNextPage: React.PropTypes.func,
	results: React.PropTypes.object
};

export default PaginationLinks;