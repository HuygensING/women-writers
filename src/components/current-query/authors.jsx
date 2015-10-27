import React from "react";
import CurrentQuery from "hire-current-query";

class AuthorsCurrentQuery extends React.Component {

	render() {
		let queryProps = this.props;
		let hasAuthorFacets = queryProps.queries.last.facetValues.length;
		let hasAuthorFullTextSearchParameters = (queryProps.queries.last.fullTextSearchParameters || []).length;

		return hasAuthorFacets || hasAuthorFullTextSearchParameters ? (
			<ul>
				<li><h3>Criteria</h3></li>
				<li>
					<h4>Woman authors</h4>
					<CurrentQuery {...queryProps} />
				</li>
			</ul>
		) : null;
	}
}

export default AuthorsCurrentQuery;