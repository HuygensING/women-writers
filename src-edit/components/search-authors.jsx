import React from "react";
import cx from "classnames";

import FacetedSearch from "hire-faceted-search";

class SearchAuthors extends React.Component {
	render() {
		return (
			<FacetedSearch
				config={{
					baseURL: "https://acc.repository.huygens.knaw.nl/v2",
					searchPath: "/search/wwpersons",
					levels: [],
					headers: {VRE_ID: "WomenWriters"}
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
					"dynamic_s_collective"
				]}
				labels={{
					facetTitles: {
						"dynamic_s_deathplace": "Place of Death",
						"dynamic_s_birthplace": "Place of birth",
						"dynamic_s_gender": "Gender",
						"dynamic_s_residence": "Country of residence",
						"dynamic_s_relatedLocations": "Related country",
						"dynamic_s_religion": "Religion",
						"dynamic_s_language": "Language",
						"dynamic_s_deathDate": "Year of Death",
						"dynamic_s_birthDate": "Year of birth",
						"dynamic_s_collective": "Memberships",
						"dynamic_sort_name": "Name",
						"dynamic_k_birthDate": "Date of Birth",
						"dynamic_k_deathDate": "Date of Death",
						"gender": "Gender",
						"birthDate": "Date of birth",
						"deathDate": "Date of death",
						"name": "Name",
						"residenceLocation": "Country of residence"
					}
				}}
				metadataList={[
					"name",
					"birthDate",
					"deathDate",
					"residenceLocation"
				]}
				onChange={(results, query) => console.log({RESULTS: results, QUERY: query})}
				onSelect={(item) =>
					this.props.router.navigate(`/persons/${item.id}`)
				}
			/>
		);
	}
}

export default SearchAuthors;