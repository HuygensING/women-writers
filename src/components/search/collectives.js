import React from "react";
import SolrFacetedSearch from "solr-faceted-search-react";
import searchClient from "../../search-clients/collectives-search-client";
import customComponents from "./custom/collectives"

class CollectiveSearch extends React.Component {

	constructor(props) {
		super(props);
		searchClient.onChange = props.onCollectiveSearchChange;
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.collectiveSearch !== this.props.collectiveSearch;
	}

	componentDidMount() {
		const { collectiveSearch } = this.props;
		if (collectiveSearch.query.searchFields.length === 0) {
			searchClient.initialize();
		}
	}


	render() {
		const { collectiveSearch } = this.props;
		return (
			<SolrFacetedSearch
				{...collectiveSearch}
				{...searchClient.getHandlers()}
				customComponents={customComponents}
				bootstrapCss={true}
				truncateFacetListsAt={20}
				onSelectDoc={() => {}}
			/>
		);
	}
}

export default CollectiveSearch;
