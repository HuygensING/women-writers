import React from "react";
import DocumentCurrentQuery from "./current-query/document";
import { defaultComponentPack } from "solr-faceted-search-react";
import { Link } from "react-router";
import { urls } from "../../../router";

const documentComponents = {
	...defaultComponentPack,
	results: {
		...defaultComponentPack.results,
		result: (props) => {
			const authorName = props.doc.authorName_ss ?
				(<span style={{color: "#888"}}>{props.doc.authorName_ss.join("; ")}<br /></span>) :
				null;

			return (
				<li className="list-group-item" style={{display: "flex"}}>
					<span style={{flexShrink: 1, textAlign: "right", display: "inline-block", width: "50px", paddingRight: "10px"}}>
						{props.start / props.rows * props.rows + props.resultIndex + 1}.
					</span>
					<span style={{flexGrow: 1}}>
						{authorName}
						<Link to={urls.publicationIndex(props.doc.id)}>
							{props.doc.displayName_s}
						</Link>
					</span>
					<span style={{"flexShrink": 1, color: "#888", whiteSpace: "nowrap"}}>
						{(props.doc.publishLocation_ss || []).join()}{" "}
						{props.doc.date_i}
					</span>
			</li>
			);
		}
	},
	searchFields: {
		...defaultComponentPack.searchFields,
		currentQuery: DocumentCurrentQuery
	}
};

documentComponents.results.result.propTypes = {
	doc: React.PropTypes.object
};

export default documentComponents;
