import React from "react";

import StringComponent from "../../../values/string";
import Relation from "../../../values/relation";
import PersonRelation from "../../../values/relation-person";

class BasicInfo extends React.Component {
	render() {
		let model = this.props.author;

		let names = (model.names.length) ?
			model.names.map((name, index) => <li key={index}>{name.components.map((c) => c.value).join(" ")}</li>) :
			<li>-</li>;

		let pid = model["^pid"] ? <a className="link" href={model["^pid"]} target="_blank">{model["^pid"]}</a> : "-";
		return (
			<ul className="record">
				<li>
					<label>Names</label>
					<ul>{names}</ul>
				</li>
				<li>
					<label>Persistent ID</label>
					{pid}
				</li>
				<li>
					<label>Pseudonyms</label>
					<Relation values={model["@relations"].hasPseudonym} />
				</li>
				<li>
					<label>Person type</label>
					<StringComponent value={model.types.join(", ")} />
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
				<li>
					<label>Related to</label>
					<PersonRelation onNavigate={this.props.onNavigate} values={model["@relations"].isRelatedTo} />
				</li>
			</ul>
		);
	}
}

BasicInfo.propTypes = {
	author: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default BasicInfo;