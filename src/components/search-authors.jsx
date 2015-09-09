import React from "react";
import cx from "classnames";

import config from "../config";

import FacetedSearch from "hire-faceted-search";

let createFacet = function(el, title) {
	let ul = el.querySelector("ul.hire-faceted-search-facets");

	let li = document.createElement("li")
	li.className = "hire-facet hire-list-facet";

	let header = document.createElement("header");

	let h3 = document.createElement("h3");
	h3.innerHTML = title;

	header.appendChild(h3);
	li.appendChild(header);
	ul.appendChild(li);
};

class SearchAuthors extends React.Component {
	constructor(props) {
		super(props);

		this.facetsAdded = false;
	}

	addFacets() {
		if (!this.facetsAdded) {
			setTimeout(() => {
				let el = React.findDOMNode(this);
				createFacet(el, "Marital status");
				createFacet(el, "Children");
				createFacet(el, "Social class");
				createFacet(el, "Education");

				this.facetAdded = true;
			}, 100);
		}
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
					}
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
					"dynamic_s_types"
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
						"dynamic_s_types": "Types"

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
				onChange={this.addFacets.bind(this)}
				onSelect={this.props.onSelect}
			/>
		);
	}
}

SearchAuthors.propTypes = {
	visible: React.PropTypes.bool
};

export default SearchAuthors;