import React from "react";
import CurrentQuery from "hire-current-query";
import config from "../../../config";

class AuthorReceptionsCurrentQuery extends React.Component {

	render() {
		let queryProps = {
			labels: config.authors.labels,
			onChangeSearchTerm: this.props.onChangeSearchTerm,
			onChangeFullTextField: this.props.onChangeFullTextField,
			onSelectFacetValue: this.props.onSelectFacetValue,
			queries: {last: this.props.activeQuery},
			results: {last: {facets: this.props.activeFacets}}
		};
		let hasAuthorFacets = queryProps.queries.last.facetValues.length;
		let hasAuthorFullTextSearchParameters = (queryProps.queries.last.fullTextSearchParameters || []).length;

		return hasAuthorFacets || hasAuthorFullTextSearchParameters ? (
			<ul>
				<li>
					<h4>Woman authors</h4>
					<CurrentQuery {...queryProps} />
				</li>
			</ul>
		) : null;
	}
}

AuthorReceptionsCurrentQuery.propTypes = {
	activeFacets: React.PropTypes.array,
	activeQuery: React.PropTypes.object,
	onChangeFullTextField: React.PropTypes.func,
	onChangeSearchTerm: React.PropTypes.func,
	onSelectFacetValue: React.PropTypes.func
};

export default AuthorReceptionsCurrentQuery;