import React from "react";

import StringComponent from "../../../values/string";
import Relation from "../../../values/relation";

class Personal extends React.Component {
	render() {
		let model = this.props.author;

		return (
			<ul className="record">
				<li>
					<label>Marital status</label>
					<Relation values={model["@relations"].hasMaritalStatus} />
				</li>
				<li>
					<label>Spouse of</label>
					<Relation values={model["@relations"].isSpouseOf} />
				</li>
				<li>
					<label>Related to</label>
					<Relation values={model["@relations"].isRelatedTo} />
				</li>
				<li>
					<label>Children</label>
					<StringComponent value={model.children} />
				</li>
				<li>
					<label>Social class</label>
					<Relation values={model["@relations"].hasSocialClass} />
				</li>
				<li>
					<label>Education</label>
					<Relation values={model["@relations"].hasEducation} />
				</li>
				<li>
					<label>Religion</label>
					<Relation values={model["@relations"].hasReligion} />
				</li>
				<li>
					<label>Bibliography</label>
					<StringComponent value={model.bibliography} />
				</li>
				<li>
					<label>Notes</label>
					<StringComponent value={model.notes} />
				</li>
			</ul>
		);
	}
}

export default Personal;