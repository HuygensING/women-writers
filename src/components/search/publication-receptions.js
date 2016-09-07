import React from "react";
import SolrFacetedSearch from "solr-faceted-search-react";
import searchClient from "../../search-clients/document-reception-search-client";
import customComponents from "./custom/document-receptions";

import { setPersonQueryFromDocumentFilters } from "../../search-clients/person-search-client";
import { setDocumentQueryFromDocumentReceptionFilters } from "../../search-clients/document-search-client";


class PublicationReceptionSearch extends React.Component {

	constructor(props) {
		super(props);
		searchClient.onChange = props.onPublicationReceptionSearchChange;
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.documentReceptionSearch !== this.props.documentReceptionSearch;
	}

	render() {
		const { documentReceptionSearch } = this.props;
		return (
			<SolrFacetedSearch
				{...documentReceptionSearch}
				{...searchClient.getHandlers()}
				bootstrapCss={true}
				customComponents={customComponents}
				truncateFacetListsAt={20}
				onPersonQueryChange={setPersonQueryFromDocumentFilters}
				onDocumentQueryChange={setDocumentQueryFromDocumentReceptionFilters}
				onSelectDoc={() => {}}
			/>
		);
	}
}

export default PublicationReceptionSearch;
