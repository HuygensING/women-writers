import React from "react";
import { urls } from "../../../../router";
import { Link } from "react-router";

class AuthorResult extends React.Component {
	render() {
		const { doc, start, resultIndex, rows } = this.props;
		return (
			<li className="list-group-item" style={{display: "flex"}}>
				<span style={{flexShrink: 1, textAlign: "right", display: "inline-block", width: "40px", paddingRight: "10px"}}>
					{start / rows * rows + resultIndex + 1}.
				</span>
				<Link to={urls.authorIndex(doc.id)} style={{"flexGrow": "1", whiteSpace: "nowrap", paddingRight: "1em"}}>{doc.displayName_s}</Link>
				{doc.birthDate_i || doc.deathDate_i
					? <span style={{color: "#666", whiteSpace: "nowrap", paddingRight: "1em"}}>
							{doc.birthDate_i || "?"}
					{" "}&mdash;{" "}
					{doc.deathDate_i || "?"}
						</span>
					: null}
				<span title={doc.relatedLocations_ss ? doc.relatedLocations_ss.sort((a, b) => a.localeCompare(b)).join(", ") : null} style={{"flexShrink": 1, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
					{doc.relatedLocations_ss ? doc.relatedLocations_ss.join(", ") : null}
				</span>
			</li>
		);
	}
}

export default AuthorResult;