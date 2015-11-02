import React from "react";
import cx from "classnames";

import PublicationHeader from "./header";
import EditButton from "../edit-button";
import PublicationRecord from "./record";
import PublicationForm from "./form";
import EditFooter from "../save-footer";
import Link from "../link";
import PaginationLinks from "../links/pagination";

class PublicationController extends React.Component {
	render() {
		let editButton = (this.props.edit) ?
			null :
			<EditButton
				model={this.props.publication}
				onRefresh={this.props.onRefresh}
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
				onCancel={this.props.onCancel.bind(this, "publication")}
				type="publication" /> :
			null;

		let graphLink = this.props.publication._id ?
			<Link className="graph-link" href={"/graph/documents/" + this.props.publication._id} onNavigate={this.props.onNavigate} value="Graph" /> :
			null;

		let resultsLink = <Link className="pagination-link" href="/documents" onNavigate={this.props.onNavigate} value="◂ Results" />;
		let paginationLinks = this.props.publication._id ?
			<PaginationLinks
				href="/documents/"
				id={this.props.publication._id}
				onNavigate={this.props.onNavigate}
				onNavigateNextPage={this.props.onNavigateNextPage}
				results={this.props.results} /> :
			null;

		return (
			<div
				className={cx(
					"publication",
					{visible: this.props.visible}
				)}>
				{resultsLink}
				<PublicationHeader
					publication={this.props.publication} />
				{paginationLinks}
				{editButton}
				{graphLink}
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