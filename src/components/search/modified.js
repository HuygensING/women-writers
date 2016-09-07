import React from "react";
import SolrFacetedSearch from "solr-faceted-search-react";
import CustomRangeFacet from "./custom/range-facet/modified";
import personModifiedClient from "../../search-clients/person-modified-client";
import documentModifiedClient from "../../search-clients/document-modified-search";
import { defaultComponentPack } from "solr-faceted-search-react";
import { makeLabel, makeDate } from "../../util/date";
import { Link } from "react-router";
import { urls } from "../../router";

const customComponents = {
	...defaultComponentPack,
	searchFields: {
		...defaultComponentPack.searchFields,
		container: (props) => (
			<div className="col-md-12">
				{props.children}
			</div>
		),
		currentQuery: () => (<div></div>),
		"range-facet": CustomRangeFacet
	},
	results: {
		...defaultComponentPack.results,
		container: (props) => (
			<div className="col-md-12">
				{props.children}
			</div>
		)
	},
	sortFields: {
		menu: () => (<span></span>)
	}
};

const authorCustomComponents = {
	...customComponents,
	results: {
		...customComponents.results,
		result: (props) => {
			return (
				<li className="list-group-item" style={{display: "flex"}}>
					<Link to={urls.authorIndex(props.doc.id)} style={{"flexGrow": "1", whiteSpace: "nowrap", paddingRight: "1em", maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis"}} >
						{props.doc.displayName_s}
					</Link>
					<span style={{"flexShrink": 1, color: "#aaa", whiteSpace: "nowrap"}}>
						{props.doc.modifiedBy_s}{" "}
						({makeLabel(makeDate(new Date(props.doc.modified_l)))})
					</span>
				</li>
			);
		}
	}
};

const publicationCustomComponents = {
	...customComponents,
	results: {
		...customComponents.results,
		result: (props) => {
			return (
				<li className="list-group-item" style={{display: "flex"}}>
					<Link to={urls.publicationIndex(props.doc.id)} style={{"flexGrow": "1", whiteSpace: "nowrap", paddingRight: "1em", maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis"}} >
						{props.doc.displayName_s}
					</Link>
					<span style={{"flexShrink": 1, color: "#aaa", whiteSpace: "nowrap"}}>
						{props.doc.modifiedBy_s}{" "}
						({makeLabel(makeDate(new Date(props.doc.modified_l)))})
					</span>
				</li>
			);
		}
	}
};

class ModifiedSearch extends React.Component {

	componentDidMount() {
		const { modifiedSearch: { authors } } = this.props;
		if (authors.query.searchFields.length === 0) {
			personModifiedClient.initialize();
			documentModifiedClient.initialize();
		}
	}

	render() {
		const { modifiedSearch: { authors, publications } } = this.props;
		return (
			<div>
				<div className="col-md-6">
					<SolrFacetedSearch
						{...authors}
						{...personModifiedClient.getHandlers()}
						customComponents={authorCustomComponents}
						bootstrapCss={true}
						onSelectDoc={() => {}}
					/>
				</div>
				<div className="col-md-6">
					<SolrFacetedSearch
						{...publications}
						{...documentModifiedClient.getHandlers()}
						customComponents={publicationCustomComponents}
						bootstrapCss={true}
						onSelectDoc={() => {}}
					/>
				</div>
			</div>
		);
	}
}

export default ModifiedSearch;