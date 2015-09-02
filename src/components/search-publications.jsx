import React from "react";

import FacetedSearch from "hire-faceted-search";

class SearchPublications extends React.Component {
	render() {
		return (
			<FacetedSearch
				config={{
					baseURL: "https://acc.repository.huygens.knaw.nl/v2",
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
					"dynamic_s_language",
					"dynamic_s_genre"
				]}
				labels={{
					facetTitles: {
						"dynamic_s_creator": "Author",
						"dynamic_sort_creator": "Author",
						"dynamic_sort_title": "Title",
						"dynamic_s_origin": "Country of first publication",
						"dynamic_s_genre": "Genre",
						"dynamic_s_language": "Language",
						"createdBy": "Author",
						"language": "Language",
						"publishLocation": "Country of first publication",
						"date": "Date"
					}
				}}
				metadataList={[
					"createdBy",
					"publishLocation",
					"language",
					"date"
				]}
				numberedResults={true}
				onSelect={(item) =>
					this.props.router.navigate(`/documents/${item.id}`)
				}
			/>
		);
	}
}

export default SearchPublications;