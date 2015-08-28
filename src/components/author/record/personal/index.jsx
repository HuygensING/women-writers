import React from "react";

import StringComponent from "../../../values/string";
import Relation from "../../../values/relation";

class Personal {
	render() {
		let model = this.props.value;

		return (
			<ul className="record">
				<li>
					<label>Marital status</label>
					<Relation values={model.getIn(["@relations", "hasMaritalStatus"]).toJS()} />
				</li>
				<li>
					<label>Spouse of</label>
					<Relation values={model.getIn(["@relations", "isSpouseOf"]).toJS()} />
				</li>
				<li>
					<label>Children</label>
					<StringComponent value={model.get("children")} />
				</li>
				<li>
					<label>Social class</label>
					<Relation values={model.getIn(["@relations", "hasSocialClass"]).toJS()} />
				</li>
				<li>
					<label>Education</label>
					<Relation values={model.getIn(["@relations", "hasEducation"]).toJS()} />
				</li>
				<li>
					<label>Religion</label>
					<Relation values={model.getIn(["@relations", "hasReligion"]).toJS()} />
				</li>
				<li>
					<label>Bibliography</label>
					<StringComponent value={model.get("bibliography")} />
				</li>
				<li>
					<label>Notes</label>
					<StringComponent value={model.get("notes")} />
				</li>
			</ul>
		);
	}
}

export default Personal;