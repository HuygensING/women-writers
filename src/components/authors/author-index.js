import React from "react";
import { urls } from "../../router";
import cx from "classnames";
import { Link } from "react-router";
import AuthorTabs from "./tabs";
import AuthorHeader from "./header";
import ModifiedBy from "../values/modified-by";

import Select from "hire-forms-select";

class AuthorIndex extends React.Component {

	componentDidMount() {
		const {entity, onFetchAuthor, onNewAuthor, params: { id }} = this.props;

		// If the requested id from the route does not match the data, or if there is no data
		if ((!entity.data && id) || (id && entity.data && entity.data._id !== id) ) {
			// Fetch the correct author based on the id.
			onFetchAuthor(id);
		} else if (!id) {
			onNewAuthor();
		}
	}

	componentWillReceiveProps(nextProps) {
		const { onFetchAuthor } = this.props;

		// Triggers fetch data from server based on id from route.
		if (this.props.params.id !== nextProps.params.id) {
			onFetchAuthor(nextProps.params.id);
		}
	}


	render() {
		const {
			entity,
			location: { pathname },
			params: { tab },
			user,
			pagination: { authorPages },
			onSelectVariationData,
			otherData
		} = this.props;

		if (!entity.data || entity.data["@type"] !== "wwperson") { return null; }

		const pageIndex = authorPages.indexOf(entity.data._id);
		const nextAuthor = pageIndex > -1 && pageIndex < authorPages.length - 1 ?
			<Link className="btn btn-default" to={urls.authorIndex(authorPages[pageIndex + 1])}>Next ▸</Link> : null;

		const prevAuthor = pageIndex > -1 && pageIndex > 0 ?
			<Link className="btn btn-default" to={urls.authorIndex(authorPages[pageIndex - 1])}>◂ Previous</Link> : null;

		const loggedIn = user && user.token;
		const id = entity.data._id || null;

		const editing = !entity.transactionPending && loggedIn && (pathname.match(/\/edit$/) || pathname.match(/\/new$/));

		const editButton = loggedIn && id && !editing ?
			<Link className="btn btn-default" to={urls.authorEdit(id, tab || "basic-info")}>
				Edit
			</Link> : null;

		const tabRoute = (toTab) => editing ? urls.authorEdit(id, toTab) : urls.authorTab(id, toTab);

		const variations = entity.data["@variationRefs"].filter((v) => v.type !== "person" && v.type !== "wwperson");

		const variationSelect = variations.length > 0 ? (
			<div className="variation-select">
				<Select placeholder="- Show other data -"
						options={variations.map((v) => v.type)}
						onChange={onSelectVariationData}
						value={otherData["@type"]}
				/>
			</div>
		) : null;

		const tabLinks = id ? (
			<div className="list-group">
				<Link className={cx("list-group-item", {active: !tab || tab === "basic-info"})} to={tabRoute("basic-info")}>
					Basic info
				</Link>
				<Link className={cx("list-group-item", {active: tab === "personal-situation"})} to={tabRoute("personal-situation")}>
					Personal situation
				</Link>
				<Link className={cx("list-group-item", {active: tab === "professional-situation"})} to={tabRoute("professional-situation")}>
					Professional situation
				</Link>
				<Link className={cx("list-group-item", {active: tab === "publications"})} to={tabRoute("publications")}>
					Publications of this author
				</Link>
				<Link className={cx("list-group-item", {active: tab === "receptions"})} to={tabRoute("receptions")}>
					Receptions of this author
				</Link>
				<Link className={cx("list-group-item", {active: tab === "links"})} to={tabRoute("links")}>
					Links to relevant projects and sites
				</Link>
				<Link className={cx("list-group-item")} to={urls.graph("persons", id)}>
					Graph
				</Link>
			</div>
		) : loggedIn ? (
			<div className="list-group">
				<Link className={cx("list-group-item", {active: !tab || tab === "basic-info"})} to={urls.authorNew()}>
					Basic info
				</Link>
			</div>
		) : null;

		return (
			<div className={cx("author", "overview", {"transaction-pending": entity.transactionPending})}>
				<div className="col-md-12 row">
					<div className="col-md-3">
						<Link className="btn btn-default" to={urls.authorSearch()}>◂ Results</Link>
					</div>
					<div className="col-md-6">
						<AuthorHeader author={entity.data} />
					</div>
					<div className="col-md-3">
						<div className="btn-group pull-right">
							{prevAuthor}
							{nextAuthor}
						</div>
					</div>
				</div>
				<div className="col-md-12 row">
					<div className="col-md-3">
						{tabLinks}
						<ModifiedBy label="Created by" {...entity.data["^created"]} />
						<ModifiedBy label="Modified by" {...entity.data["^modified"]} />
						{editButton}
					</div>
					<div className="col-md-9">
						{variationSelect}
						{!tab ? <AuthorTabs {...this.props} editable={editing ? true : false} /> : this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default AuthorIndex;