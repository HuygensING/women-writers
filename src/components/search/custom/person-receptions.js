import React from "react";
import PersonReceptionCurrentQuery from "./current-query/person-receptions";
import receptionListFacetMaker from "./list-facet/receptions";
import authorReceptionDefinitions from "../../../definitions/author-receptions";

import {defaultComponentPack} from "solr-faceted-search-react";
import { Link } from "react-router";
import { urls } from "../../../router";

const { inversions, resultLabels } = authorReceptionDefinitions;
const invert = (key) => resultLabels[inversions[key]];


const documentComponents = {
	...defaultComponentPack,
	results: {
		...defaultComponentPack.results,
		result: (props) => {
			const authorName = props.doc.authorName_ss ?
				(<span style={{color: "#888"}}>{props.doc.authorName_ss.join("; ")}<br /></span>) :
				null;
			return (
				<li className="list-group-item">
					<span style={{textAlign: "right", display: "inline-block", width: "50px", paddingRight: "10px"}}>
						{props.start / props.rows * props.rows + props.resultIndex + 1}.
					</span>

					<div style={{width: "calc(42% - 25px)", display: "inline-block", verticalAlign: "top", paddingRight: "20px"}}>
						<Link to={urls.authorIndex(props.doc.person_id_s)}>
							{props.doc.person_displayName_s}
						</Link>
						<br />
						<span style={{color: "#666"}}>
							{props.doc.person_birthDate_i} - {props.doc.person_deathDate_i}
						</span>
						<br />
						<span style={{color: "#888"}}>
							<span style={{float: "right"}}>{(props.doc.person_relatedLocations_ss || []).join("; ")}</span>
							{props.doc.person_gender_s}
						</span>
					</div>

					<div style={{width: "16%", display: "inline-block", verticalAlign: "top", color: "#666"}}>
						{invert(props.doc.relationType_s)}
					</div>

					<div style={{width: "calc(42% - 25px)", display: "inline-block", verticalAlign: "top", paddingRight: "1em"}}>
						{authorName}
						<Link to={urls.authorReceptionIndex(props.doc.reception_id_s)}>
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
		"list-facet": receptionListFacetMaker("authors"),
		currentQuery: PersonReceptionCurrentQuery
	}
};

documentComponents.results.result.propTypes = {
	doc: React.PropTypes.object
};

export default documentComponents;
