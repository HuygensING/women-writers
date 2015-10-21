let baseUrl = "/repository/api/v2.1";

export default {
	authorUrl: baseUrl + "/domain/wwpersons",
	baseUrl: baseUrl,
	federatedAuthenticateUrl: "https://secure.huygens.knaw.nl/saml2/login",
	graphUrl: baseUrl + "/graph",
	domainUrl: baseUrl + "/domain",
	basicAuthenticateUrl: baseUrl + "/authenticate",
	publicationUrl: baseUrl + "/domain/wwdocuments",
	saveRelationUrl: baseUrl + "/domain/wwrelations",
	relationsUrl: baseUrl + "/system/relationtypes",
	userUrl: baseUrl + "/system/users/me",
	publications: {
		labels: {
			facetTitles: {
				"dynamic_s_relation": "Reception type",
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
		},
		facetList: [
			"dynamic_s_origin",
			"dynamic_s_sources",
			"dynamic_s_date",
			"dynamic_s_document_type",
			"dynamic_s_language",
			"dynamic_s_genre"
		],
		facetSortMap: {
			"dynamic_s_creator": {
				type: "alphabet",
				direction: "ascending"
			}
		}
	}
};