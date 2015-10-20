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

	onChange(results, query) {
		if(this.props.visible) {
			this.props.onChange(results, query);
		}
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
				facetList={[
					"dynamic_s_origin",
					"dynamic_s_sources",
					"dynamic_s_date",
					"dynamic_s_document_type",
					"dynamic_s_language",
					"dynamic_s_genre"
				]}
				facetSortMap={{
					"dynamic_s_creator": {
						type: "alphabet",
						direction: "ascending"
					}
				}}
				labels={{
					facetTitles: {
						"dynamic_s_sources": "Sources",
						"dynamic_s_date": "Date",
						"dynamic_s_document_type": "Document type",
						"dynamic_s_genre": "Genre",
						"dynamic_s_language": "Language",
						"dynamic_s_origin": "Country of first publication",
						"dynamic_t_title": "Title",
						"dynamic_s_author_birthDate": "Year of birth",
						"dynamic_s_author_birthplace": "Place of birth",
						"dynamic_s_author_children": "Children",
						"dynamic_s_author_collective": "Memberships",
						"dynamic_s_author_deathDate": "Year of Death",
						"dynamic_s_author_deathplace": "Place of Death",
						"dynamic_s_author_education": "Education",
						"dynamic_s_author_gender": "Gender",
						"dynamic_s_author_marital_status": "Marital status",
						"dynamic_s_author_residence": "Country of residence",
						"dynamic_s_author_relatedLocations": "Related country",
						"dynamic_s_author_religion": "Religion",
						"dynamic_s_author_social_class": "Social class",
						"dynamic_s_author_types": "Types",
						"dynamic_s_author_financials": "Financials",
						"dynamic_s_author_profession": "Profession"
					},
					"createdBy": "Author",
					"language": "Language",
					"publishLocation": "Country of first publication",
					"date": "Date",
					"dynamic_sort_creator": "Author",
					"dynamic_sort_title": "Title"
				}}
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
	onChange: React.PropTypes.func,
	onSearchId: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	query: React.PropTypes.object,
	visible: React.PropTypes.bool
};

export default SearchPublications;