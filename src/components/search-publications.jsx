import React from "react";
import cx from "classnames";
import config from "../config";

import FacetedSearch from "hire-faceted-search";
import CurrentQuery from "./current-query/publications";

class SearchPublications extends React.Component {
	constructor(props) {
		super(props);

		this.facetsAdded = false;
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.visible || this.props.visible;
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

	render() {
		return (
			<FacetedSearch
				className={cx({
					visible: this.props.visible
				})}
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
						{name: "dynamic_t_title"}
					]
				}}
				currentQueryComponent={CurrentQuery}
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