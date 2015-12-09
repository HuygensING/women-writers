import React from "react";
import CurrentQuery from "hire-current-query";

class PublicationsCurrentQuery extends React.Component {

	render() {
		let queryProps = this.props;
		let authorFacets = queryProps.queries.last.facetValues.filter((fv) => fv.name.indexOf("_author_") > -1);
		let publicationFacets = queryProps.queries.last.facetValues.filter((fv) => fv.name.indexOf("_author_") < 0);
		let authorFullTextSearchParameters = (queryProps.queries.last.fullTextSearchParameters || []).filter((p) => p.name.indexOf("_author_") > -1);
		let publicationFullTextSearchParameters = (queryProps.queries.last.fullTextSearchParameters || []).filter((p) => p.name.indexOf("_author_") < 0);

		let authorElem = authorFacets.length > 0 || authorFullTextSearchParameters.length > 0 ?
			(
				<li>
					<h4>Women authors</h4>
					{React.createElement(CurrentQuery, {
						...queryProps,
						queries: {
							...queryProps.queries,
							last: {
								...queryProps.queries.last,
								facetValues: authorFacets,
								fullTextSearchParameters: authorFullTextSearchParameters
							}
						}
					})}
				</li>
			) : null;

		let publicationElem = publicationFacets.length > 0 || publicationFullTextSearchParameters.length > 0 ?
			(
				<li>
					<h4>Their publications</h4>
					{React.createElement(CurrentQuery, {
						...queryProps,
						queries: {
							...queryProps.queries,
							last: {
								...queryProps.queries.last,
								facetValues: publicationFacets,
								fullTextSearchParameters: publicationFullTextSearchParameters
							}
						}
					})}
				</li>
			) : null;
		return authorElem || publicationElem ? (
			<ul>
				{authorElem}
				{publicationElem}
			</ul>
		) : null;
	}
}

export default PublicationsCurrentQuery;