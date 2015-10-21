import React from "react";
import FacetedSearch from "hire-faceted-search";
import AuthorResult from "./result/author";
import PublicationResult from "./result/publication";
import config from "../../config";


class ReceptionSearch extends React.Component {

	componentWillReceiveProps(nextProps) {
		if(nextProps.visible && nextProps.pendingSearchId) {
			console.log("ReceptionSearch visible with pendingSearchId: ", this.props.type);
			this.props.onVisible(nextProps.pendingSearchId);
		}
	}

	render() {
		if (this.props.searchId) {
			return (<FacetedSearch
						config={{
							baseURL: config.baseUrl,
							searchPath: "/search/wwrelations/wwdocuments",
							headers: {
								VRE_ID: "WomenWriters",
								Accept: "application/json"
							},
							queryDefaults: {otherSearchId: this.props.searchId},
							hideFreeTextSearch: true,
							fullTextSearchFields: [
								{name: "dynamic_t_title"}
							]
						}}
						facetList={["dynamic_s_relation", ...config.publications.facetList]}
						facetSortMap={config.publications.facetSortMap}
						labels={config.publications.labels}
						onSelect={this.props.onSelect}
						resultComponent={this.props.type === "authors" ? AuthorResult : PublicationResult}
						/>);
		} else {
			return <span>{JSON.stringify(this.props)}</span>;
		}
	}
}

ReceptionSearch.propTypes = {
	onSelect: React.PropTypes.func,
	onVisible: React.PropTypes.func,
	searchId: React.PropTypes.string,
	type: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default ReceptionSearch;