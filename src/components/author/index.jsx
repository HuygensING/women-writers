import React from "react";
import cx from "classnames";

import AuthorHeader from "./header";
import EditButton from "../edit-button";
import AuthorRecord from "./record";
import AuthorForm from "./form";
import EditFooter from "../save-footer";

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
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let body = (this.props.edit) ?
			<AuthorForm
				{...this.props}
				author={this.props.author}
				onFormChange={this.props.onFormChange}
				onFormDelete={this.props.onFormDelete}
				onTabChange={this.props.onTabChange}
				relations={this.props.relations} /> :
			<AuthorRecord
				{...this.props}
				author={this.props.author}
				onTabChange={this.props.onTabChange}
				relations={this.props.relations} />;

		let footer = (this.props.edit) ?
			<EditFooter
				onToggleEdit={this.props.onToggleEdit}
				onDelete={this.props.onDeleteAuthor}
				onSave={this.props.onSaveAuthor}
				type="author" /> :
			null;

		return (
			<div
				className={cx(
					"author",
					{visible: this.props.visible}
				)}>
				<AuthorHeader
					author={this.props.author} />
				{editButton}
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
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "links"]),
	user: React.PropTypes.object,
	visible: React.PropTypes.bool
};

AuthorController.defaultProps = {
	edit: false,
	tab: "basic info",
	visible: false
};

export default AuthorController;