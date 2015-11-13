import React from "react";
import cx from "classnames";

import config from "../config";
import FacetedSearch from "hire-faceted-search";


class SearchCollectives extends React.Component {

	render() {
		return (
			<div className={cx({visible: this.props.visible, "search-collectives": true})}>
				<FacetedSearch
					config={{
						baseURL: config.baseUrl,
						searchPath: "/search/wwcollectives",
						headers: {
							VRE_ID: "WomenWriters",
							Accept: "application/json"
						}
					}}
					labels={{facetTitles: {term: "Search term", "dynamic_s_type": "Type"}}}
					numberedResults={true}
					onChange={this.props.onResultsChange}
					onSelect={this.props.onSelect}
				/>
			</div>
		);
	}
}

SearchCollectives.propTypes = {
	onResultsChange: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	visible: React.PropTypes.bool
};

export default SearchCollectives;