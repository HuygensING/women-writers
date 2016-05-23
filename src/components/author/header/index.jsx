import React from "react";

import RelationAuthor from "../../values/relation-person";

class AuthorHeader extends React.Component {
	render() {
		let model = this.props.author;

		let name = model.names.map((current) => current.components.map((component) => component.value).join(" "))[0] || model.tempName || "-";

		let birthYear = model.birthDate === "" ?
			"?" :
			model.birthDate;

		let deathYear = model.deathDate === "" ?
			"?" :
			model.deathDate;

		let years = (birthYear === "?" && deathYear === "?") ?
			null :
			<small className="years">({birthYear} - {deathYear})</small>;

		let sex;
		if (model.gender === "Female") {
			sex = <small className="gender" >♀</small>;
		} else if (model.gender === "Male") {
			sex = <small className="gender">♂</small>;
		}

		let pseudonyms, isPseudonymOf;
		if (model["@relations"].hasOwnProperty("hasPseudonym") && model["@relations"].hasPseudonym.length) {
			pseudonyms = (
				<small className="pseudonyms">
					Pseudonyms
					<RelationAuthor onNavigate={this.props.onNavigate} values={model["@relations"].hasPseudonym} />
				</small>
			);
		}
		if (model["@relations"].hasOwnProperty("isPseudonymOf") && model["@relations"].isPseudonymOf.length) {
			pseudonyms = (
				<small className="pseudonyms">
					Is pseudonym of
					<RelationAuthor onNavigate={this.props.onNavigate} values={model["@relations"].isPseudonymOf} />
				</small>
			);
		}
		return (
			<header className="page">
				<h2 title={name}>
					{name}
					{years}
					{sex}
					{pseudonyms}
					{isPseudonymOf}
				</h2>
			</header>
		);
	}
}

AuthorHeader.propTypes = {
	author: React.PropTypes.object,
	onNavigate: React.PropTypes.func
};

export default AuthorHeader;