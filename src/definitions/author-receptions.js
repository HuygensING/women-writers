export default {
	outBound: [
		"hasBiography",
		"isPersonCommentedOnIn",
		"isDedicatedPersonOf",
		"isPersonAwarded",
		"isPersonListedOn",
		"isPersonMentionedIn",
		"hasObituary",
		"isPersonQuotedIn",
		"isPersonReferencedIn"
	],
	inBound: [
		"isBiographyOf",
		"commentsOnPerson",
		"isDedicatedTo",
		"isAwardForPerson",
		"listsPerson",
		"mentionsPerson",
		"isObituaryOf",
		"quotesPerson",
		"referencesPerson"
	],
	inversions: {
		"isBiographyOf": "hasBiography",
		"commentsOnPerson": "isPersonCommentedOnIn",
		"isDedicatedTo": "isDedicatedPersonOf",
		"isAwardForPerson": "isPersonAwarded",
		"listsPerson": "isPersonListedOn",
		"mentionsPerson": "isPersonMentionedIn",
		"isObituaryOf": "hasObituary",
		"quotesPerson": "isPersonQuotedIn",
		"referencesPerson": "isPersonReferencedIn"
	},
	resultLabels: {
		"hasBiography": "Has biography",
		"isPersonCommentedOnIn": "Was commented on in",
		"isDedicatedPersonOf": "Has dedications in",
		"isPersonAwarded": "Awards",
		"isPersonListedOn": "Listed on",
		"isPersonMentionedIn": "Mentioned in",
		"hasObituary": "Has obituary",
		"isPersonQuotedIn": "Was quoted in",
		"isPersonReferencedIn": "Was referenced in"
	},
	overviewLabels: {
		"hasBiography": "Biography",
		"isPersonCommentedOnIn": "Commented on in",
		"isDedicatedPersonOf": "Dedicated of",
		"isPersonAwarded": "Awarded for",
		"isPersonListedOn": "Listed on",
		"isPersonMentionedIn": "Mentioned in",
		"hasObituary": "Obituary",
		"isPersonQuotedIn": "Quoted in",
		"isPersonReferencedIn": "Referenced in",

		"isBiographyOf": "Is a biography of",
		"commentsOnPerson": "Is a comment on",
		"isDedicatedTo": "Is dedicated to",
		"isAwardForPerson": "Awards",
		"listsPerson": "Lists",
		"mentionsPerson": "Mentions",
		"isObituaryOf": "Is an obituary of",
		"quotesPerson": "Quotes",
		"referencesPerson": "References"
	},

	facetLabels: {
		"isBiographyOf": "Biography",
		"commentsOnPerson": "Comments",
		"isDedicatedTo": "Dedication",
		"isAwardForPerson": "Award",
		"listsPerson": "Listing",
		"mentionsPerson": "Mention",
		"isObituaryOf": "Obituary",
		"quotesPerson": "Quoting",
		"referencesPerson": "Referencing"
	}
};