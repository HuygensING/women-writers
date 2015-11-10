let baseUrl = "/repository/api/v2.1";

export default {
	authorUrl: baseUrl + "/domain/wwpersons",
	baseUrl: baseUrl,
	federatedAuthenticateUrl: "https://secure.huygens.knaw.nl/saml2/login",
	graphUrl: baseUrl + "/graph",
	domainUrl: baseUrl + "/domain",
	basicAuthenticateUrl: baseUrl + "/authenticate",
	publicationUrl: baseUrl + "/domain/wwdocuments",
	collectiveUrl: baseUrl + "/domain/wwcollectives",
	saveRelationUrl: baseUrl + "/domain/wwrelations",
	relationsUrl: baseUrl + "/system/relationtypes",
	userUrl: baseUrl + "/system/users/me",
	authors: {
		labels: {
			facetTitles: {
				"dynamic_i_birthDate": "Year of birth",
				"dynamic_s_birthplace": "Place of birth",
				"dynamic_s_children": "Children",
				"dynamic_s_collective": "Memberships",
				"dynamic_i_deathDate": "Year of Death",
				"dynamic_s_deathplace": "Place of Death",
				"dynamic_s_education": "Education",
				"dynamic_s_gender": "Gender",
				"dynamic_s_language": "Language",
				"dynamic_s_marital_status": "Marital status",
				"dynamic_s_residence": "Country of residence",
				"dynamic_s_relatedLocations": "Related country",
				"dynamic_s_religion": "Religion",
				"dynamic_s_social_class": "Social class",
				"dynamic_s_types": "Person Types",
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
		}
	},
	publications: {
		labels: {
			facetTitles: {
				"dynamic_s_relation": "Reception type",
				"dynamic_s_sources": "Sources",
				"dynamic_i_date": "Date",
				"dynamic_s_document_type": "Document type",
				"dynamic_s_genre": "Genre",
				"dynamic_s_language": "Language",
				"dynamic_s_origin": "Country of first publication",
				"dynamic_t_title": "Title",
				"dynamic_t_author_name": "Name",
				"dynamic_i_author_birthDate": "Year of birth",
				"dynamic_s_author_birthplace": "Place of birth",
				"dynamic_s_author_children": "Children",
				"dynamic_s_author_collective": "Memberships",
				"dynamic_i_author_deathDate": "Year of Death",
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
			facetValues: {
				"dynamic_s_relation": {
					"isEditionOf": "Is edition of",
					"hasEdition": "has edition",

					"isSequelOf": "Is sequel of",
					"hasSequel": "has sequel",

					"isTranslationOf": "Is translation of",
					"hasTranslation": "has translation",

					"isAdaptationOf": "Is adaptation of",
					"hasAdaptation": "has adaptation",

					"isPlagiarismOf": "Is plagiarism of",
					"hasPlagiarismBy": "has plagiarism",

					"hasAnnotationsOn": "Has annotations on",
					"isAnnotatedIn": "is annotated in",

					"isBibliographyOf": "Is bibliography of",
					"hasBibliography": "has bibliography",

					"isCensoringOf": "Is censoring of",
					"isCensoredBy": "is censored by",

					"commentsOnWork": "Comments on work",
					"isWorkCommentedOnIn": "is commented on in",

					"isAnthologyContaining": "Is anthology containing",
					"containedInAnthology": "is contained in anthology",

					"isCopyOf": "Is copy of",
					"isCopiedBy": "is copied by",


					"isAwardForWork": "Is award for work",
					"isWorkAwarded": "is awarded with",

					"isPrefaceOf": "Is preface of",
					"hasPreface": "has preface",

					"isIntertextualTo": "Is intertextual to",
					"isIntertextualOf": "is intertextual of",

					"listsWork": "Lists work",
					"isWorkListedOn": "is listed on",

					"mentionsWork": "Mentions work",
					"isWorkMentionedIn": "is mentioned in",

					"isParodyOf": "Is parody of",
					"isParodiedBy": "is parodied by",

					"quotesWork": "Quotes work",
					"isWorkQuotedIn": "is quoted in",

					"referencesWork": "References work",
					"isWorkReferencedIn": "is referenced in",

					"isDocumentSourceOf": "Is document source of",
					"hasDocumentSource": "has source",

					"isBiographyOf": "Is biography of",
					"hasBiography": "has biography",

					"commentsOnPerson": "Comments on person",
					"isPersonCommentedOnIn": "is commented on in",

					"isDedicatedTo": "Is dedicated to",
					"isDedicatedPersonOf": "is subject of dedication in",

					"isAwardForPerson": "Is award for person",
					"isPersonAwarded": "is awarded with",

					"listsPerson": "Lists person",
					"isPersonListedOn": "is listed on",

					"mentionsPerson": "Mentions person",
					"isPersonMentionedIn": "is mentioned in",

					"isObituaryOf": "Is obituary of",
					"hasObituary": "has obituary",

					"quotesPerson": "Quoted person",
					"isPersonQuotedIn": "is quoted in",

					"referencesPerson": "References person",
					"isPersonReferencedIn": "is referenced in"
				}
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
			"dynamic_i_date",
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