const displayNameMap = {
	"is_creator_of": "",
	"is_created_by": "",
	"has_archive_keyword": "",
	"is_archive_keyword_of": "",
	"has_archiver_keyword": "",
	"is_archiver_keyword_of": "",
	"has_legislation_keyword": "",
	"is_legislation_keyword_of": "",
	"has_archive_person": "",
	"is_archive_person_of": "",
	"has_archiver_person": "",
	"is_archiver_person_of": "",
	"has_legislation_person": "",
	"is_legislation_person_of": "",
	"has_archive_place": "",
	"is_archive_place_of": "",
	"has_archiver_place": "",
	"is_archiver_place_of": "",
	"has_legislation_place": "",
	"is_legislation_place_of": "",
	"has_parent_archive": "",
	"has_child_archive": "",
	"has_sibling_archive": "",
	"has_sibling_archiver": "",
	commentsOnPerson: "",
	commentsOnWork: "Comments on",
	containedInAnthology: "Anthology",
	hasAdaptation: "Adaptation",
	hasAnnotationsOn: "Annotations on",
	hasBibliography: "Bibliography",
	hasBiography: "Biography",
	hasBirthPlace: "Birth place",
	hasGenre: "Genre",
	hasDeathPlace: "Death place",
	hasResidenceLocation: "Residence location",
	hasPersonLanguage: "Language",
	hasWorkLanguage: "Language",
	hasLocation: "Location",
	hasPublishLocation: "Publish location",
	hasMember: "Member",
	hasPseudonym: "Pseudonym",
	hasEdition: "Edition",
	hasSequel: "Sequel",
	hasTranslation: "Translation",
	hasSourceCategory: "Source category",
	hasDocumentSource: "Document source",
	hasEducation: "Education",
	hasFinancialSituation: "Financial situation",
	hasMaritalStatus: "Marital status",
	hasObituary: "Obituary",
	hasPlagiarismBy: "Plagiarism by",
	hasPreface: "Preface",
	hasProfession: "Profession",
	hasReligion: "Religion",
	hasSocialClass: "Social class",
	isAdaptationOf: "Adaptation of",
	isAnnotatedIn: "Annotated in",
	isAnthologyContaining: "Anthology containing",
	isAwardForWork: "Award for",
	isBibliographyOf: "Bibliography of",
	isBiographyOf: "Biography of",
	isBirthPlaceOf: "Birth place of",
	isCensoredBy: "Censored by",
	isCensoringOf: "Censoring of",
	isCollaboratorOf: "Collaborator of",
	isCreatedBy: "Created by",
	isCreatorOf: "Creator of",
	isCopiedBy: "Copied by",
	isCopyOf: "Copy of",
	isChildOf: "Child of",
	isDedicatedPersonOf: "Dedicated of",
	isDedicatedTo: "Dedicated To",
	isDeathPlaceOf: "Death place of",
	isEditionOf: "Edition of",
	isGenreOf: "Genre of",
	isGrandparentOf: "Grandparent of",
	isGrandchildOf: "Grandchild of",
	isLocationOf: "Location of",
	isMemberOf: "Member of",
	isParentOf: "Parent of",
	isPublishLocationOf: "Publish location of",
	isPseudonymOf: "Pseudonym of",
	isPublishedBy: "Published by",
	isPublisherOf: "Publisher of",
	isPersonLanguageOf: "PersonLanguage of",
	isPersonCommentedOnIn: "Commented on in",
	isPersonAwarded: "Awarded for",
	isPersonListedOn: "Listed on",
	isPersonMentionedIn: "Mentioned in",
	isPersonQuotedIn: "Quoted in",
	isPersonReferencedIn: "Referenced in",
	isResidenceLocationOf: "ResidenceLocation of",
	isRelatedTo: "Related to",
	isPlagiarismOf: "Plagiarism of",
	isSpouseOf: "Spouse of",
	isStoredAt: "Stored at",
	isStorageOf: "Storage of",
	isSequelOf: "Sequel of",
	isTranslationOf: "Translation of",
	isAwardForPerson: "Award for",
	isPrefaceOf: "Preface of",
	isIntertextualOf: "Intertextual of",
	isIntertextualTo: "Intertextual to",
	isObituaryOf: "Obituary of",
	isParodiedBy: "Parodied by",
	isParodyOf: "Parody of",
	isSourceCategoryOf: "SourceCategory of",
	isDocumentSourceOf: "Document source of",
	isEducationOf: "Education of",
	isFinancialSituationOf: "Financial situation of",
	isMaritalStatusOf: "Marital status of",
	isProfessionOf: "Profession of",
	isReligionOf: "Religion of",
	isSocialClassOf: "Social class of",
	isSiblingOf: "Sibling of",
	isWorkLanguageOf: "Language of",
	isWorkCommentedOnIn: "Commented on in",
	isWorkAwarded: "Awarded for",
	isWorkListedOn: "Listed on",
	isWorkMentionedIn: "Mentioned in",
	isWorkQuotedIn: "Quoted in",
	isWorkReferencedIn: "Referenced in",
	listsPerson: "",
	listsWork: "Listing",
	mentionsPerson: "",
	mentionsWork: "",
	referencesPerson: "",
	referencesWork: "",
	quotesPerson: "",
	quotesWork: ""
};

let hasType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type || relation.targetTypeName === type;
};

let hasBothType = function(type) {
	return (relation) =>
		relation.sourceTypeName === type && relation.targetTypeName === type;
};

let toDisplayName = function(prev, current) {
	prev[current.regularName] = displayNameMap[current.regularName];
	prev[current.inverseName] = displayNameMap[current.inverseName];

	return prev;
};

let initialState = {
	all: [],
	author: [],
	authorPublication: [],
	displayNames: {},
	publication: [],
	publicationPublication: [],
	requesting: false
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "REQUEST_RELATIONS":
			return {...state, ...{requesting: true}};

		case "RECEIVE_RELATIONS":
			let authorRelations = action.response.filter(hasType("person"));
			let publicationRelations = action.response.filter(hasType("document"));
			return {...state, ...{
				all: action.response,
				author: authorRelations,
				authorPublication: authorRelations.filter(hasType("document")),
				displayNames: action.response.reduce(toDisplayName, {}),
				publication: publicationRelations,
				publicationPublication: publicationRelations.filter(hasBothType("document")),
				requesting: false
			}};

		default:
			return state;
	}
}