import React from "react";
import cx from "classnames";
import config from "../config";

import FacetedSearch from "hire-faceted-search";
import CurrentQuery from "./current-query/publications";
import isEqual from "lodash.isequal";
import PublicationResult from "./result/publication";

class SearchPublications extends React.Component {
	constructor(props) {
		super(props);

		this.facetsAdded = false;
	}

	shouldComponentUpdate(nextProps) {
		return this.props.visible || nextProps.visible || !isEqual(this.props.query, nextProps.query);
	}

	onChange(results, query) {
		if(this.props.visible) {
			this.props.onQueryChange(results, query);
		}
		this.props.onResultsChange(results);
	}

	onSearchId(searchId) {
		this.props.onSearchId(searchId);
	}

	permalink() {
		let arr = window.location.href.split("/");
		return arr[0] + "//" + arr[2] + "/womenwriters/vre/stored-search/publications/" + encodeURIComponent(JSON.stringify(this.props.query));
	}

	onPermaClick(ev) {
		ev.target.select();
	}

	render() {
		return (
			<div className={cx("search-publications", {visible: this.props.visible})}>
				<div className="permalink">
					Store this search:
					<input onClick={this.onPermaClick.bind(this)} readOnly value={this.permalink()} />
				</div>
				<FacetedSearch
					config={{
						baseURL: config.baseUrl,
						searchPath: "/search/wwdocuments",
						levels: ["dynamic_sort_creator", "dynamic_sort_title"],
						headers: {
							Accept: "application/json",
							VRE_ID: "WomenWriters"
						},
						hideFreeTextSearch: true,
						fullTextSearchFields: [
							{name: "dynamic_t_title"},
							{name: "dynamic_t_notes", position: "bottom"}
						]
					}}
					customComponents={{
						currentQuery: CurrentQuery,
						result: PublicationResult
					}}
					facetList={config.publications.facetList}
					facetSortMap={config.publications.facetSortMap}
					labels={config.publications.labels}
					metadataList={[
						"createdBy",
						"publishLocation",
						"language",
						"date"
					]}
					numberedResults={true}
					onChange={this.onChange.bind(this)}
					onSearchId={this.onSearchId.bind(this)}
					onSelect={this.props.onSelect}
					query={this.props.query}
				/>
			</div>
		);
	}
}

SearchPublications.propTypes = {
	onQueryChange: React.PropTypes.func,
	onResultsChange: React.PropTypes.func,
	onSearchId: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	query: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default SearchPublications;
