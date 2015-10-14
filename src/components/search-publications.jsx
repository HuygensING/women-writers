import React from "react";
import cx from "classnames";

import config from "../config";

import FacetedSearch from "hire-faceted-search";


class SearchPublications extends React.Component {
	constructor(props) {
		super(props);

		this.facetsAdded = false;
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
					}
				}}
				facetList={[
					"dynamic_s_creator",
					"dynamic_s_origin",
					"dynamic_b_is_source",
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
						"dynamic_b_is_source": "Is source",
						"dynamic_s_creator": "Author",
						"dynamic_s_date": "Date",
						"dynamic_s_document_type": "Document type",
						"dynamic_s_genre": "Genre",
						"dynamic_s_language": "Language",
						"dynamic_s_origin": "Country of first publication"
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
				onSelect={this.props.onSelect}
			/>
		);
	}
}

export default SearchPublications;