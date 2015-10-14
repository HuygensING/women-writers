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
	userUrl: baseUrl + "/system/users/me"
};