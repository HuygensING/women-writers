let authorRelationMap = {
	hasBirthPlace: "wwlocations",
	hasDeathPlace: "wwlocations",
	hasEducation: "wwkeywords",
	hasFinancialSituation: "wwkeywords",
	hasMaritalStatus: "wwkeywords",
	isCollaboratorOf: "wwpersons",
	isCreatorOf: "wwdocuments",
	isMemberOf: "wwcollectives",
	isRelatedTo: "wwpersons",
	isSpouseOf: "wwpersons",
	hasPersonLanguage: "wwlanguages",
	hasProfession: "wwkeywords",
	hasPseudonym: "wwpersons",
	hasReligion: "wwkeywords",
	hasResidenceLocation: "wwlocations",
	hasSocialClass: "wwkeywords"
};

let publicationRelationMap = {
	isCreatedBy: "wwpersons",
	hasPublishLocation: "wwlocations",
	hasGenre: "wwkeywords",
	hasWorkLanguage: "wwlanguages"
};

export default Object.assign(authorRelationMap, publicationRelationMap);