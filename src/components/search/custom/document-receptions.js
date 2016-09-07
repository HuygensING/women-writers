import React from "react";
import DocumentReceptionCurrentQuery from "./current-query/document-receptions";
import receptionListFacetMaker from "./list-facet/receptions";
import publicationReceptionDefinitions from "../../../definitions/publication-receptions";
import {defaultComponentPack} from "solr-faceted-search-react";
import { Link } from "react-router";
import { urls } from "../../../router";

const { inversions, overviewLabels } = publicationReceptionDefinitions;
const invert = (key) => overviewLabels[inversions[key]];

const documentComponents = {
	...defaultComponentPack,
	results: {
		...defaultComponentPack.results,
		result: (props) => {
			const authorName = props.doc.authorName_ss ?
				(<span style={{color: "#888"}}>{props.doc.authorName_ss.join("; ")}<br /></span>) :
				null;
			const authorName1 = props.doc.document_authorName_ss ?
				(<span style={{color: "#888"}}>{props.doc.document_authorName_ss.join("; ")}<br /></span>) :
				null;
			return (
				<li className="list-group-item">
					<span style={{textAlign: "right", display: "inline-block", width: "50px", paddingRight: "10px"}}>
						{props.start / props.rows * props.rows + props.resultIndex + 1}.
					</span>

					<div style={{width: "calc(42% - 25px)", display: "inline-block", verticalAlign: "top", paddingRight: "20px"}}>
						{authorName1}
						<Link to={urls.publicationReceptionIndex(props.doc.document_id_s)}>
							{props.doc.document_displayName_s}
						</Link>
						<br />
						<span style={{color: "#888"}}>
							<span style={{float: "right"}}>{props.doc.document_date_i}</span>
							{(props.doc.document_publishLocation_ss || []).join("; ")}
						</span>
					</div>

					<div style={{width: "16%", display: "inline-block", verticalAlign: "top", color: "#666"}}>
						{invert(props.doc.relationType_s)}
					</div>


					<div style={{width: "calc(42% - 25px)", display: "inline-block", verticalAlign: "top", paddingRight: "1em"}}>
						{authorName}
						<Link to={urls.publicationReceptionIndex(props.doc.reception_id_s)}>
							{props.doc.displayName_s}
						</Link>
						<br />
						<span style={{color: "#888"}}>
							<span style={{float: "right"}}>{props.doc.date_i}</span>
							{(props.doc.publishLocation_ss || []).join("; ")}
						</span>
					</div>
				</li>
			);
		}
	},
	searchFields: {
		...defaultComponentPack.searchFields,
		currentQuery: DocumentReceptionCurrentQuery,
		"list-facet": receptionListFacetMaker("publications")
	}
};

documentComponents.results.result.propTypes = {
	doc: React.PropTypes.object
};

export default documentComponents;
