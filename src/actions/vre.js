import server from "./server";
import config from "../config";
import keywords from "../definitions/keywords";

const setVre = (vreId, afterInit) => (dispatch) =>
	server.performXhr({
		method: "GET",
		headers: {
			"Accept": "application/json"
		},
		url: `${config.apiUrl.v4}/metadata/${vreId}?withCollectionInfo=true`
	}, (err, resp) => {
		if (resp.statusCode === 200) {
			var collectionMetadata = JSON.parse(resp.body);

			// Add default value for author gender and children
			collectionMetadata.wwpersons.properties = collectionMetadata.wwpersons.properties.map((prop) =>
				prop.name === "gender" || prop.name === "children" ? {...prop, defaultValue: "UNKNOWN"} : prop
			);

			// Add default value for documentType
			collectionMetadata.wwdocuments.properties = collectionMetadata.wwdocuments.properties.map((prop) =>
				prop.name === "documentType" ? {...prop, defaultValue: "UNKNOWN"} : prop
			);

			// Add default value for collective type
			collectionMetadata.wwcollectives.properties = collectionMetadata.wwcollectives.properties.map((prop) =>
				prop.name === "type" ? {...prop, defaultValue: "UNKNOWN"} : prop
			);

			// Add all keyword values as options to the metadata
			const promises = Object.keys(collectionMetadata)
				// Make a flat list of all property definitions from metadata (with a back reference* to the collection key)
				.map((key) => collectionMetadata[key].properties.map((prop) => ({...prop, collection: key})))
				.reduce((a, b) => a.concat(b))
				// Select only the property definitions which are a keyword
				.filter((prop) => keywords.indexOf(prop.name) > -1)
				// For each keyword make a promise to fetch all values from the server
				.map((prop) => new Promise((resolve, reject) => {
					server.fastXhr({url: `${config.baseUrl}${prop.quicksearch}`}, (err, resp, kwBody) => {
						// All keyword values for the current keyword
						const data = JSON.parse(kwBody);
						// The index of this property in its current collection (using back reference*)
						const propIndex = collectionMetadata[prop.collection].properties
							.map((p, idx) => ({name: p.name, idx}))
							.find((p) => p.name === prop.name).idx;

						// Set the options property for this keyword to all possible values
						collectionMetadata[prop.collection].properties[propIndex].options = data.map((d) => ({
							key: d.key.replace(/^.+\//, ""),
							value: d.value
						}));
						resolve();
					}, reject);
				}));

			// Dispatch SET_VRE only after all keywords are resolved from the server.
			Promise.all(promises).then(() => {
				dispatch({type: "SET_VRE", vreId: vreId, collections: collectionMetadata});
				afterInit();
			});
		}
	}, () => dispatch({type: "SET_VRE", vreId: vreId, collections: {}}), `Fetch VRE description for ${vreId}`);

export {setVre};
