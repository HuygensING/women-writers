import React from "react";
import { urls } from "../../router";
import cx from "classnames";
import { Link } from "react-router";
import PublicationTabs from "./tabs";
import PublicationHeader from "./header";
import PublicationPageLinks from "./pagelinks/publication";
import PublicationReceptionPageLinks from "./pagelinks/publication-reception"
import AuthorReceptionPageLinks from "./pagelinks/author-reception";
import ModifiedBy from "../values/modified-by";
import Select from "hire-forms-select";

class PublicationIndex extends React.Component {

	componentDidMount() {
		const {entity, onFetchPublication, onNewPublication, params: { id }} = this.props;
		// If the requested id from the route does not match the data, or if there is no data
		if ((!entity.data && id) || (id && entity.data && entity.data._id !== id) ) {
			// Fetch the correct author based on the id.
			onFetchPublication(id);
		} else if (!id) {
			onNewPublication();
		}
	}

	componentWillReceiveProps(nextProps) {
		const { onFetchPublication } = this.props;
		// Triggers fetch data from server based on id from route.
		if (this.props.params.id !== nextProps.params.id) {
			onFetchPublication(nextProps.params.id);
		}
	}


	render() {
		const {
			entity,
			location: { pathname },
			params: { tab },
			user,
			pagination: { publicationPages, publicationReceptionPages, authorReceptionPages },
			onSelectVariationData,
			otherData
		} = this.props;


		if (!entity.data || entity.data["@type"] !== "wwdocument") { return null; }


		const loggedIn = user && user.token;
		const id = entity.data._id || null;

		const editing = !entity.transactionPending && loggedIn && (pathname.match(/\/edit$/) || pathname.match(/\/new$/));

		const inPublicationReceptions = pathname.match(/\/receptions\/publications\//);
		const inAuthorReceptions = pathname.match(/\/receptions\/authors\//);

		const resultLocation = inPublicationReceptions
			? urls.publicationReceptionSearch()
			: inAuthorReceptions
			? urls.authorReceptionSearch()
			: urls.publicationSearch();

		const tabRoute = (toTab, setToEdit = false) => {
			const toEdit = setToEdit ? true : editing;

			if (inPublicationReceptions) {
				return toEdit ? urls.publicationReceptionEdit(id, toTab) : urls.publicationReceptionTab(id, toTab);
			} else if (inAuthorReceptions) {
				return toEdit ? urls.authorReceptionEdit(id, toTab) : urls.authorReceptionTab(id, toTab);
			}
			return toEdit ? urls.publicationEdit(id, toTab) : urls.publicationTab(id, toTab);
		};

		const pageLinks = inPublicationReceptions
			? <PublicationReceptionPageLinks entity={entity} publicationReceptionPages={publicationReceptionPages} />
			: inAuthorReceptions
			? <AuthorReceptionPageLinks entity={entity} authorReceptionPages={authorReceptionPages} />
			: <PublicationPageLinks entity={entity} publicationPages={publicationPages} />


		const editButton = loggedIn && id && !editing ?
			<Link className="btn btn-default" to={tabRoute(tab || "basic-info", true)}>
				Edit
			</Link> : null;

		const tabLinks = id ? (
			<div className="list-group">
				<Link className={cx("list-group-item", {active: !tab || tab === "basic-info"})} to={tabRoute("basic-info")}>
					Basic info
				</Link>
				<Link className={cx("list-group-item", {active: tab === "receptions"})} to={tabRoute("receptions")}>
					Receptions
				</Link>
				<Link className={cx("list-group-item", {active: tab === "links"})} to={tabRoute("links")}>
					Links to online text
				</Link>
				<Link className={cx("list-group-item")} to={urls.graph("documents", id)}>
					Graph
				</Link>
			</div>
		) : loggedIn ? (
			<div className="list-group">
				<Link className={cx("list-group-item", {active: !tab || tab === "basic-info"})} to={urls.publicationNew()}>
					Basic info
				</Link>
			</div>
		) : null;

		const variations = entity.data["@variationRefs"].filter((v) => v.type !== "document" && v.type !== "wwdocument");

		const variationSelect = variations.length > 0 ? (
			<div className="variation-select">
				<Select placeholder="- Show other data -"
						options={variations.map((v) => v.type)}
						onChange={onSelectVariationData}
						value={otherData["@type"]}
				/>
			</div>
		) : null;

		return (
			<div className={cx("publication", "overview", {"transaction-pending": entity.transactionPending})}>

				<div className="col-md-12 row m-b-1">
					<div className="col-md-3">
						<Link className="btn btn-default" to={resultLocation}>◂ Results</Link>
					</div>
					<div className="col-md-6">
						<PublicationHeader
							publication={entity.data}
							linkToView={
								inPublicationReceptions ? "publicationReceptionIndex"
								: inAuthorReceptions ? "authorReceptionIndex"
								: "publicationIndex"
							}
						/>
					</div>
					{pageLinks}
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
						{!tab ? <PublicationTabs {...this.props} editable={editing ? true : false} /> : this.props.children}
					</div>
				</div>


			</div>
		);
	}
}

export default PublicationIndex;