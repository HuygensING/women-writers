import React from "react";
import FacetedSearch from "hire-faceted-search";
import AuthorResult from "./result/author";
import PublicationResult from "./result/publication";
import PublicationReceptionsCurrentQuery from "./current-query/publications";
import AuthorReceptionsCurrentQuery from "./current-query/authors";
import Loader from "../icons/loader";
import config from "../../config";
import {receptionTypesPerson, receptionTypesDocument} from "../../stores/all-relation-types";

class ReceptionSearch extends React.Component {

	constructor(props) {
		super(props);
		this.state = { excelUrl: null };
		this.receivedStoredQuery = false;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible && nextProps.pendingSearchId) {
			this.props.onVisible(nextProps.pendingSearchId);
		}
	}

	onSearchId(searchId) {
		const receptionTypes = this.props.type === "authors" ? receptionTypesPerson : receptionTypesDocument;

		this.setState({excelUrl: `${config.baseUrl}/search/${searchId}/xls?depth=2&types=${receptionTypes.join("&types=")}`});
	}

	render() {
		let currentQueryProps = {
			activeFacets: this.props.activeFacets,
			activeQuery: this.props.activeQuery,
			onChangeSearchTerm: (...args) => { console.log(this.props.type, args); },
			onChangeFullTextField: this.props.onUnsetFullTextField,
			onSelectFacetValue: this.props.onUnsetFacetValue
		};

		let excelLink = this.state.excelUrl ?
			<a className="excel-link" href={this.state.excelUrl} target="_blank">Download excel</a> :
			null;

		let currentQuery = this.props.type === "authors" ?
			<AuthorReceptionsCurrentQuery {...currentQueryProps} /> :
			<PublicationReceptionsCurrentQuery {...currentQueryProps} />;

		let queryProps = {otherSearchId: this.props.searchId};
		if(!this.receivedStoredQuery && this.props.storedQuery) {
			queryProps = {
				...queryProps,
				facetValues: this.props.storedQuery.receptions.facetValues,
				fullTextSearchParameters: this.props.storedQuery.receptions.fullTextSearchParameters
			};
			this.receivedStoredQuery = true;
		}
		let search = this.props.searchId ? (
			<FacetedSearch
						config={{
							baseURL: config.baseUrl,
							searchPath: "/search/wwrelations/wwdocuments",
							headers: {
								VRE_ID: "WomenWriters",
								Accept: "application/json"
							},
							hideFreeTextSearch: true,
							fullTextSearchFields: [
								{name: "dynamic_t_title"}
							]
						}}
						customComponents={{
							result: this.props.type === "authors" ? AuthorResult : PublicationResult
						}}
						facetList={["dynamic_s_relation", "dynamic_s_creator", "dynamic_s_author_gender", ...config.publications.facetList]}
						facetSortMap={config.publications.facetSortMap}
						labels={{
							...config.publications.labels,
							resultsFound: "receptions",
							facetTitles: {
								...config.publications.labels.facetTitles,
								"dynamic_s_author_gender": "Reception gender"
							}
						}}
						numbered={true}
						onChange={this.props.onChange}
						onSearchId={this.onSearchId.bind(this)}
						onSelect={this.props.onSelect}
						query={queryProps}
			/>
		) : null;

		return (
			<div className="reception-search">
				{excelLink}
				{currentQuery}
				<Loader className={!this.props.searchId ? "reception-loader" : "reception-loader hidden"} />
				{search}
			</div>
		);
	}
}

ReceptionSearch.propTypes = {
	activeFacets: React.PropTypes.array,
	activeQuery: React.PropTypes.object,
	onChange: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	onUnsetFacetValue: React.PropTypes.func,
	onUnsetFullTextField: React.PropTypes.func,
	onVisible: React.PropTypes.func,
	searchId: React.PropTypes.string,
	storedQuery: React.PropTypes.object,
	type: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default ReceptionSearch;