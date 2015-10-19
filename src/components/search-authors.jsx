import React from "react";
import cx from "classnames";

import config from "../config";

import FacetedSearch from "hire-faceted-search";

class SearchAuthors extends React.Component {
	constructor(props) {
		super(props);

		this.facetsAdded = false;
	}

	onChange(results, query) {
		if(this.props.visible) {
			console.log("AUTHOR", this.props.visible);
			this.props.onChange(results, query);
		}
	}
	groupCurrentQuery(queryProps, currentQueryComponentClass) {
		let hasAuthorFacets = queryProps.queries.last.facetValues.length;
		let hasAuthorFullTextSearchParameters = (queryProps.queries.last.fullTextSearchParameters || []).length;

		return hasAuthorFacets || hasAuthorFullTextSearchParameters ? (
			<ul>
				<li><h3>Criteria</h3></li>
				<li>
					<h4>Woman authors</h4>
					{React.createElement(currentQueryComponentClass, queryProps)}
				</li>
			</ul>
		) : null;
	}

	render() {
		return (
			<FacetedSearch
				className={cx({
					visible: this.props.visible
				})}
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
					],
					currentQueryGroupFunc: this.groupCurrentQuery.bind(this)
				}}
				facetList={[
					"dynamic_s_gender",
					"dynamic_s_residence",
					"dynamic_s_language",
					"dynamic_s_birthDate",
					"dynamic_s_birthplace",
					"dynamic_s_deathDate",
					"dynamic_s_deathplace",
					"dynamic_s_religion",
					"dynamic_s_collective",
					"dynamic_s_relatedLocations",
					"dynamic_s_children",
					"dynamic_s_language",
					"dynamic_s_marital_status",
					"dynamic_s_education",
					"dynamic_s_social_class",
					"dynamic_s_types",
					"dynamic_s_financials",
					"dynamic_s_profession"
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
				labels={{
					facetTitles: {
						"dynamic_s_birthDate": "Year of birth",
						"dynamic_s_birthplace": "Place of birth",
						"dynamic_s_children": "Children",
						"dynamic_s_collective": "Memberships",
						"dynamic_s_deathDate": "Year of Death",
						"dynamic_s_deathplace": "Place of Death",
						"dynamic_s_education": "Education",
						"dynamic_s_gender": "Gender",
						"dynamic_s_language": "Language",
						"dynamic_s_marital_status": "Marital status",
						"dynamic_s_residence": "Country of residence",
						"dynamic_s_relatedLocations": "Related country",
						"dynamic_s_religion": "Religion",
						"dynamic_s_social_class": "Social class",
						"dynamic_s_types": "Types",
						"dynamic_s_financials": "Financials",
						"dynamic_s_profession": "Profession",
						"dynamic_t_name": "Name",
						"dynamic_t_notes": "Provisional notes"
					},
					"dynamic_sort_name": "Name",
					"dynamic_k_birthDate": "Date of Birth",
					"dynamic_k_deathDate": "Date of Death",
					"gender": "Gender",
					"birthDate": "Date of birth",
					"deathDate": "Date of death",
					"name": "Name",
					"residenceLocation": "Country of residence"
				}}
				metadataList={[
					"name",
					"birthDate",
					"deathDate",
					"residenceLocation"
				]}
				numberedResults={true}
				onChange={this.onChange.bind(this)}
				onSelect={this.props.onSelect}
				query={this.props.query}
			/>
		);
	}
}

SearchAuthors.propTypes = {
	onSelect: React.PropTypes.func,
	onChange: React.PropTypes.func,
	visible: React.PropTypes.bool
};

export default SearchAuthors;