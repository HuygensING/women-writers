import React from "react";

import StringComponent from "../../../values/string";
import Relation from "../../../values/relation";

class BasicInfo {
	render() {
		let model = this.props.author;

		let names = (model.names.length) ?
			model.names.map((name, index) => <li key={index}>{name.components.map((c) => c.value).join(" ")}</li>) :
			"-";

		return (
			<ul className="record">
				<li>
					<label>Names</label>
					<span>{names}</span>
				</li>
				<li>
					<label>Pseudonyms</label>
					<Relation values={model["@relations"].hasPseudonym} />
				</li>
				<li>
					<label>Person type</label>
					<StringComponent value={model.persontype} />
				</li>
				<li>
					<label>Gender</label>
					<StringComponent value={model.gender} />
				</li>
				<li>
					<label>Birth date</label>
					<StringComponent value={model.birthDate} />
				</li>
				<li>
					<label>Birth place</label>
					<Relation values={model["@relations"].hasBirthPlace} />
				</li>
				<li>
					<label>Lived in</label>
					<Relation values={model["@relations"].hasResidenceLocation} />
				</li>
				<li>
					<label>Death date</label>
					<StringComponent value={model.deathDate} />
				</li>
				<li>
					<label>Death place</label>
					<Relation values={model["@relations"].hasDeathPlace} />
				</li>
			</ul>
		);
	}
}

export default BasicInfo;