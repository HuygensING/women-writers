import config from "../config";
import {fetch} from "./utils";
import {parseIncomingGraph} from "../stores/parsers/graph";

const types = [
	"hasEdition",
	"hasSequel",
	"hasTranslation",
	"hasAdaptation",
	"hasPlagiarismBy",
	"isAnnotatedIn",
	"hasBibliography",
	"isCensoredBy",
	"isWorkCommentedOnIn",
	"containedInAnthology",
	"isCopiedBy",
	"isWorkAwarded",
	"hasPreface",
	"isIntertextualOf",
	"isWorkListedOn",
	"isWorkMentionedIn",
	"isParodiedBy",
	"isWorkQuotedIn",
	"isWorkReferencedIn",
	"hasDocumentSource",
	"hasBiography",
	"isPersonCommentedOnIn",
	"isDedicatedPersonOf",
	"isPersonAwarded",
	"isPersonListedOn",
	"isPersonMentionedIn",
	"hasObituary",
	"isPersonQuotedIn",
	"isPersonReferencedIn",
	"isCreatorOf",
	"isRelatedTo",
	"isParentOf",
	"isSpouseOf"
].join("&types=");

let fetchDomainMetadata = function(domain, id, dispatch) {
	fetch(`${config.domainUrl}/${domain}/${id}`, (response) => {
		if(domain === "persons" && response["@variationRefs"].map((v) => v.type).indexOf("wwperson") > -1) {
			fetchDomainMetadata("wwpersons", id, dispatch);
		} else {
			dispatch({
				type: "RECEIVE_GRAPH_TABLE",
				response: response,
				id: `${domain}/${id}`
			});
		}
	});
};


export function fetchGraph(domain, id) {
	return function (dispatch, getState) {

		let found = getState().graphs.all.filter((graph) => graph.id === `${domain}/${id}`);

		if (found.length) {
			dispatch({
				type: "SET_CURRENT_GRAPH",
				current: found[0]
			});
		} else {
			fetch(`${config.graphUrl}/ww${domain}/${id}?depth=2&types=${types}`, (response) =>
				dispatch({
					type: "RECEIVE_GRAPH",
					response: parseIncomingGraph(response),
					id: `${domain}/${id}`
				})
			);
		}
		fetchDomainMetadata(domain, id, dispatch);
	};
}

export function fetchGraphTable(domain, id) {
	return function (dispatch) {
		fetchDomainMetadata(domain, id, dispatch);
	};
}