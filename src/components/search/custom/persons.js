import React from "react";
import { defaultComponentPack } from "solr-faceted-search-react";
import AuthorResult from "./result/author";
import AuthorSearchFieldContainer from "./search-field-container/authors";

const personComponents = {
	...defaultComponentPack,
	results: {
		...defaultComponentPack.results,
		result: AuthorResult
	},
	searchFields: {
		...defaultComponentPack.searchFields,
		container: AuthorSearchFieldContainer
	}
};

personComponents.results.result.propTypes = {
	doc: React.PropTypes.object
};

export default personComponents;
