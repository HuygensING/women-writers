import React from "react";

import config from "../config";

import FacetedSearch from "hire-faceted-search";

class SearchAuthors extends React.Component {
	render() {
		return (
			<FacetedSearch
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
				onSelect={(item) =>
					this.props.router.navigate(`/persons/${item.id}`)
				}
			/>
		);
	}
}

export default SearchAuthors;