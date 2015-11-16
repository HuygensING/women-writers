import React from "react";
import cx from "classnames";

import config from "../config";
import FacetedSearch from "hire-faceted-search";
import CurrentQuery from "./current-query/authors";
import isEqual from "lodash.isequal";

import AuthorResult from "./result/author";

class SearchAuthors extends React.Component {
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
		return arr[0] + "//" + arr[2] + "/womenwriters/vre/stored-search/authors/" + encodeURIComponent(JSON.stringify(this.props.query));
	}

	onPermaClick(ev) {
		ev.target.select();
	}

	render() {
		return (
			<div className={cx("search-authors", {visible: this.props.visible})}>
				<div className="permalink">
					Share / store this search:
					<input onClick={this.onPermaClick.bind(this)} readOnly value={this.permalink()} />
				</div>
				<FacetedSearch
					config={{
						baseURL: config.baseUrl,
						searchPath: "/search/wwpersons",
						headers: {
							VRE_ID: "WomenWriters",
							Accept: "application/json"
						},
						hideFreeTextSearch: true,
						fullTextSearchFields: [
							{name: "dynamic_t_name"},
							{name: "dynamic_t_notes", position: "bottom"}
						]
					}}
					customComponents={{
						currentQuery: CurrentQuery,
						result: AuthorResult
					}}
					facetList={[
						"dynamic_s_types",
						"dynamic_s_gender",
						"dynamic_s_residence",
						"dynamic_s_language",
						"dynamic_i_birthDate",
						"dynamic_i_deathDate",
						"dynamic_s_birthplace",
						"dynamic_s_deathplace",
						"dynamic_s_relatedLocations",
						"dynamic_s_marital_status",
						"dynamic_s_children",
						"dynamic_s_social_class",
						"dynamic_s_education",
						"dynamic_s_religion",

						"dynamic_s_profession",
						"dynamic_s_financials",
						"dynamic_s_collective"
					]}
					facetSortMap={{
						"dynamic_s_birthDate": {
							type: "alphabet",
							direction: "ascending"
						},
						"dynamic_s_deathDate": {
							type: "alphabet",
							direction: "ascending"
						}
					}}
					labels={config.authors.labels}
					metadataList={[
						"name",
						"birthDate",
						"deathDate",
						"residenceLocation"
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

SearchAuthors.propTypes = {
	onQueryChange: React.PropTypes.func,
	onResultsChange: React.PropTypes.func,
	onSearchId: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	query: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default SearchAuthors;
