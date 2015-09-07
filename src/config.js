let baseUrl = "/repository/api/v2";

export default {
	authorUrl: baseUrl + "/domain/wwpersons",
	baseUrl: baseUrl,
	federatedAuthenticateUrl: "https://secure.huygens.knaw.nl/saml2/login",
	basicAuthenticateUrl: baseUrl + "/authenticate",
	publicationUrl: baseUrl + "/domain/wwdocuments",
	relationsUrl: baseUrl + "/system/relationtypes",
	userUrl: baseUrl + "/system/users/me"
};