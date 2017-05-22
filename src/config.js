export default {
	baseUrl: `${process.env.SERVER}`,
	apiUrl: {
		"v2.1": `${process.env.SERVER}/v2.1`,
		"v4": `${process.env.SERVER}/v2.1`
	},
	apiVersion: "v4",
	federatedAuthenticateUrl: `https://secure.huygens.knaw.nl/saml2/login`,
	basicAuthenticateUrl: `${process.env.SERVER}/v2.1/authenticate`,
	userUrl: `${process.env.SERVER}/v2.1/system/users/me`,
	graphUrl: `${process.env.SERVER}/v2.1/graph`,
	solrUrls: {
		wwcollectives: "https://repository.huygens.knaw.nl/solr/wwcollectives/select",
		wwpersons: "https://repository.huygens.knaw.nl/solr/wwpersons/select",
		wwdocuments: "https://repository.huygens.knaw.nl/solr/wwdocuments/select",
		wwdocumentreceptions: "https://repository.huygens.knaw.nl/solr/wwdocumentreceptions/select",
		wwpersonreceptions: "https://repository.huygens.knaw.nl/solr/wwpersonreceptions/select",
	}
};
