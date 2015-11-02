import React from "react";
import cx from "classnames";

import AuthorHeader from "./header";
import EditButton from "../edit-button";
import AuthorRecord from "./record";
import AuthorForm from "./form";
import EditFooter from "../save-footer";
import Link from "../link";
import PaginationLinks from "../links/pagination";

/*
 * AuthorController for the AuthorRecord and AuthorForm
 *
 * AuthorRecord and AuthorForm share a controller, because they
 * use the same data.
 */
class AuthorController extends React.Component {
	render() {
		let editButton = (this.props.edit) ?
			null :
			<EditButton
				model={this.props.author}
				onRefresh={this.props.onRefresh}
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let body = (this.props.edit) ?
			<AuthorForm
				{...this.props}
				author={this.props.author}
				onFormChange={this.props.onFormChange}
				onFormDelete={this.props.onFormDelete}
				onNavigate={this.props.onNavigate}
				onTabChange={this.props.onTabChange}
				relations={this.props.relations} /> :
			<AuthorRecord
				{...this.props}
				author={this.props.author}
				onNavigate={this.props.onNavigate}
				onTabChange={this.props.onTabChange}
				relations={this.props.relations} />;

		let footer = (this.props.edit) ?
			<EditFooter
				onCancel={this.props.onCancel.bind(this, "author")}
				onDelete={this.props.onDeleteAuthor}
				onSave={this.props.onSaveAuthor}
				type="author" /> :
			null;

		let graphLink = this.props.author._id ?
			<Link className="graph-link" href={"/graph/persons/" + this.props.author._id} onNavigate={this.props.onNavigate} value="Graph" /> :
			null;

		let resultsLink = <Link className="pagination-link" href="/persons" onNavigate={this.props.onNavigate} value="◂ Results" />;
		let paginationLinks = this.props.author._id ?
			<PaginationLinks
				href="/persons/"
				id={this.props.author._id}
				onNavigate={this.props.onNavigate}
				onNavigateNextPage={this.props.onNavigateNextPage}
				results={this.props.results} /> :
			null;

		return (
			<div
				className={cx(
					"author",
					{visible: this.props.visible}
				)}>
				{resultsLink}
				<AuthorHeader
					onNavigate={this.props.onNavigate}
					author={this.props.author} />
				{paginationLinks}
				{editButton}
				{graphLink}
				{body}
				{footer}
			</div>
		);
	}
}

AuthorController.propTypes = {
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	onToggleEdit: React.PropTypes.func,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "receptions", "links"]),
	user: React.PropTypes.object,
	visible: React.PropTypes.bool
};

AuthorController.defaultProps = {
	edit: false,
	tab: "basic info",
	visible: false
};

export default AuthorController;