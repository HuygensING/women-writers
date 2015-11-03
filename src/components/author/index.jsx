import React from "react";
import cx from "classnames";

import AuthorHeader from "./header";
import EditButton from "../edit-button";
import AuthorRecord from "./record";
import AuthorForm from "./form";
import EditFooter from "../save-footer";
import Link from "../link";
import PaginationLinks from "../links/pagination";
import VariationData from "../values/variation-data";
import Select from "hire-forms-select";


/*
 * AuthorController for the AuthorRecord and AuthorForm
 *
 * AuthorRecord and AuthorForm share a controller, because they
 * use the same data.
 */
class AuthorController extends React.Component {

	onSelectVariation(type) {
		let found = (this.props.author["@variationRefs"] || []).filter((v) => v.type === type);
		if (found.length) {
			this.props.onSelectVariation(type, found[0].id);
		} else {
			this.props.onSelectVariation(null);
		}
	}

	render() {
		let editButton = (this.props.edit && this.props.user && this.props.user.token) ?
			null :
			<EditButton
				model={this.props.author}
				onRefresh={this.props.onRefresh}
				onToggleEdit={this.props.onToggleEdit}
				user={this.props.user} />;

		let body = (this.props.edit && this.props.user && this.props.user.token) ?
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

		let footer = (this.props.edit && this.props.user && this.props.user.token) ?
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

		let variations = (this.props.author["@variationRefs"] || []).filter((v) => v.type !== "wwperson").map((v) => v.type);
		let variationSelect = variations.length ?
			<Select
				onChange={this.onSelectVariation.bind(this)}
				options={["Show other data", ...variations]}
				value={this.props.showVariation ? this.props.showVariation : "Show other data"} />
			: null;

		let variationDataComponent = this.props.variationData ?
			<VariationData data={this.props.variationData} /> :
			null;

		return (
			<div
				className={cx(
					"author",
					{requesting: this.props.requesting},
					{visible: this.props.visible}
				)}>
				{resultsLink}
				<AuthorHeader author={this.props.author} onNavigate={this.props.onNavigate} />
				<div className="variations">
					{variationSelect}
					{variationDataComponent}
				</div>
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
	author: React.PropTypes.object,
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	onCancel: React.PropTypes.func,
	onDeleteAuthor: React.PropTypes.func,
	onFormChange: React.PropTypes.func,
	onFormDelete: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onNavigateNextPage: React.PropTypes.func,
	onRefresh: React.PropTypes.func,
	onSaveAuthor: React.PropTypes.func,
	onSelectVariation: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	relations: React.PropTypes.object,
	requesting: React.PropTypes.bool,
	results: React.PropTypes.object,
	showVariation: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "receptions", "links"]),
	user: React.PropTypes.object,
	variationData: React.PropTypes.object,
	visible: React.PropTypes.bool
};

AuthorController.defaultProps = {
	edit: false,
	tab: "basic info",
	visible: false
};

export default AuthorController;