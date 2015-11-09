import React from "react";
import cx from "classnames";

import PublicationHeader from "./header";
import EditButton from "../edit-button";
import PublicationRecord from "./record";
import PublicationForm from "./form";
import EditFooter from "../save-footer";
import Link from "../link";
import PaginationLinks from "../links/pagination";
import ModifiedBy from "../values/modified-by";

class PublicationController extends React.Component {
	render() {
		let editButton = (this.props.edit && this.props.user && this.props.user.token) ?
			null :
			<EditButton
				model={this.props.publication}
				onRefresh={this.props.onRefresh}
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let body = (this.props.edit && this.props.user && this.props.user.token) ?
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

		let footer = (this.props.edit && this.props.user && this.props.user.token) ?
			<EditFooter
				onCancel={this.props.onCancel.bind(this, "publication")}
				onDelete={this.props.onDeletePublication}
				onSave={this.props.onSavePublication}
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

		let createdBy = <ModifiedBy {...this.props.publication["^created"]} label="Created by" />;
		let modifiedBy = <ModifiedBy {...this.props.publication["^modified"]} label="Modified by" />;

		return (
			<div
				className={cx(
					"publication",
					{requesting: this.props.requesting},
					{visible: this.props.visible}
				)}>
				{resultsLink}
				<PublicationHeader publication={this.props.publication} />
				{paginationLinks}

				<div className="extra-info">
					{graphLink}
					{createdBy}
					{modifiedBy}
					{editButton}
				</div>
				{body}
				{footer}
			</div>
		);
	}
}

PublicationController.propTypes = {
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	onCancel: React.PropTypes.func,
	onDeletePublication: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onNavigateNextPage: React.PropTypes.func,
	onRefresh: React.PropTypes.func,
	onSavePublication: React.PropTypes.func,
	onSelectVariation: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	publication: React.PropTypes.object,
	relations: React.PropTypes.object,
	requesting: React.PropTypes.bool,
	results: React.PropTypes.object,
	showVariation: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"]),
	user: React.PropTypes.object,
	variationData: React.PropTypes.object,
	visible: React.PropTypes.bool
};

PublicationController.defaultProps = {
	edit: false,
	tab: "basic info",
	visible: false
};

export default PublicationController;