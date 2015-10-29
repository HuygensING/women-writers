import React from "react";
import FacetedSearch from "hire-faceted-search";
import AuthorResult from "./result/author";
import PublicationResult from "./result/publication";
import PublicationReceptionsCurrentQuery from "./current-query/publications";
import AuthorReceptionsCurrentQuery from "./current-query/authors";
import Loader from "../icons/loader";
import config from "../../config";


class ReceptionSearch extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible && nextProps.pendingSearchId) {
			this.props.onVisible(nextProps.pendingSearchId);
		}
	}

	render() {
		let currentQueryProps = {
			activeFacets: this.props.activeFacets,
			activeQuery: this.props.activeQuery,
			onChangeSearchTerm: (...args) => { console.log(this.props.type, args); },
			onChangeFullTextField: this.props.onUnsetFullTextField,
			onSelectFacetValue: this.props.onUnsetFacetValue
		};

		let currentQuery = this.props.type === "authors" ?
			<AuthorReceptionsCurrentQuery {...currentQueryProps} /> :
			<PublicationReceptionsCurrentQuery {...currentQueryProps} />;
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
						facetList={["dynamic_s_relation", ...config.publications.facetList]}
						facetSortMap={config.publications.facetSortMap}
						labels={config.publications.labels}
						onSelect={this.props.onSelect}
						query={{otherSearchId: this.props.searchId}}
			/>
		) : null;

		return (
			<div className="reception-search">
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
	onSelect: React.PropTypes.func,
	onUnsetFacetValue: React.PropTypes.func,
	onUnsetFullTextField: React.PropTypes.func,
	onVisible: React.PropTypes.func,
	searchId: React.PropTypes.string,
	type: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default ReceptionSearch;