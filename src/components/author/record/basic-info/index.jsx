import React from "react";

import StringComponent from "../../../values/string";
import Relation from "../../../values/relation";

class BasicInfo {
	render() {
		let model = this.props.value;

		let names = (model.get("names").size) ?
			model.get("names").toJS().map((name, index) => <li key={index}>{name.firstName} {name.lastName}</li>) :
			"-";

		return (
			<ul className="record">
				<li>
					<label>Names</label>
					<span>{names}</span>
				</li>
				<li>
					<label>Pseudonyms</label>
					<Relation values={model.getIn(["@relations", "hasPseudonym"]).toJS()} />
				</li>
				<li>
					<label>Person type</label>
					<StringComponent value={model.get("persontype")} />
				</li>
				<li>
					<label>Gender</label>
					<StringComponent value={model.get("gender")} />
				</li>
				<li>
					<label>Birth date</label>
					<StringComponent value={model.get("birthDate")} />
				</li>
				<li>
					<label>Birth place</label>
					<Relation values={model.getIn(["@relations", "hasBirthPlace"]).toJS()} />
				</li>
				<li>
					<label>Lived in</label>
					<Relation values={model.getIn(["@relations", "hasResidenceLocation"]).toJS()} />
				</li>
				<li>
					<label>Death date</label>
					<StringComponent value={model.get("deathDate")} />
				</li>
				<li>
					<label>Death place</label>
					<Relation values={model.getIn(["@relations", "hasDeathPlace"]).toJS()} />
				</li>
			</ul>
		);
	}
}

export default BasicInfo;