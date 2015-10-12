import React from "react";
import cx from "classnames";

import PublicationHeader from "./header";
import EditButton from "../edit-button";
import PublicationRecord from "./record";
import PublicationForm from "./form";
import EditFooter from "../save-footer";

class PublicationController extends React.Component {
	render() {
		let editButton = (this.props.edit) ?
			null :
			<EditButton
				model={this.props.publication}
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let body = (this.props.edit) ?
			<PublicationForm
				{...this.props}
				onNavigate={this.props.onNavigate}
				onTabChange={this.props.onTabChange}
				publication={this.props.publication}
				relations={this.props.relations} /> :
			<PublicationRecord
				{...this.props}
				onNavigate={this.props.onNavigate}
				onTabChange={this.props.onTabChange}
				publication={this.props.publication}
				relations={this.props.relations} />;

		let footer = (this.props.edit) ?
			<EditFooter
				onDelete={this.props.onDeletePublication}
				onSave={this.props.onSavePublication}
				onToggleEdit={this.props.onToggleEdit}
				type="publication" /> :
			null;

		return (
			<div
				className={cx(
					"publication",
					{visible: this.props.visible}
				)}>
				<PublicationHeader
					publication={this.props.publication} />
				{editButton}
				{body}
				{footer}
			</div>
		);
	}
}

PublicationController.propTypes = {
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"]),
	user: React.PropTypes.object,
	visible: React.PropTypes.bool
};

PublicationController.defaultProps = {
	edit: false,
	tab: "basic info",
	visible: false
};

export default PublicationController;