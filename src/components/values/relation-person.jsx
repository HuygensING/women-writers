import React from "react";
import Link from "../link";

const genders = ["FEMALE", "MALE", "NOT_APPLICABLE", "UNKNOWN"];

const labelMap = {
	"": "",
	FEMALE: "♀",
	MALE: "♂",
	NOT_APPLICABLE: "(gender not applicable)",
	UNKNOWN: "(gender unknown)"
};

class PersonRelation extends React.Component {

	renderLink(v, index) {
		let genderMap = this.props.genderMap || {};

		return (
			<li key={index}>
				<Link
					href={`/persons/${v.key.substr(v.key.lastIndexOf("/") + 1)}`}
					onNavigate={this.props.onNavigate}
					value={`${v.value} ${labelMap[genderMap[v.key.substr(v.key.lastIndexOf("/") + 1)] || ""]}`} />
			</li>
		);
	}

	renderGender(g) {
		let genderMap = this.props.genderMap || {};

		return this.props.values
			.filter((v) => genderMap[v.key.substr(v.key.lastIndexOf("/") + 1)] === g)
			.map(this.renderLink.bind(this));
	}

	renderGenderNotFound() {
		let genderMap = this.props.genderMap || {};

		return this.props.values
			.filter((v) => !genderMap[v.key.substr(v.key.lastIndexOf("/") + 1)])
			.map(this.renderLink.bind(this));
	}

	render() {
		if (!this.props.values.length) {
			return <span>-</span>;
		}


		return this.props.genderMap ?
			(<span>
				{genders.map((g) => (
					<ul className="relation person-relation genderified">
						{this.renderGender(g)}
					</ul>
				))}
				<ul className="relation person-relation">
					{this.renderGenderNotFound()}
				</ul>
			</span>)
			:
			(<span>
				<ul className="relation person-relation">
					{this.props.values.map(this.renderLink.bind(this))}
				</ul>
			</span>
		);
	}
}

PersonRelation.propTypes = {
	genderMap: React.PropTypes.object,
	onNavigate: React.PropTypes.func,
	values: React.PropTypes.array
};

PersonRelation.defaultProps = {
	values: []
};

export default PersonRelation;