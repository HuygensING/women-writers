import React from "react";

import RelationAuthor from "../../values/relation-person";

class AuthorHeader extends React.Component {
	render() {
		let model = this.props.author;

		let name = model.names.reduce((str, current) => {
			if (str !== "") {
				str = str + "; ";
			}

			return str + current.firstName + " " + current.lastName;
		}, "");

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
			sex = <small>♀</small>;
		} else if (model.gender === "Male") {
			sex = <small>♂</small>;
		}

		let pseudonyms;
		if (model["@relations"].hasOwnProperty("hasPseudonym") && model["@relations"].hasPseudonym.length) {
			pseudonyms = (
				<small className="pseudonyms">
					Pseudonyms
					<RelationAuthor values={model["@relations"].hasPseudonym} />
				</small>
			);
		}

		return (
			<header className="page">
				<h2>
					{name}
					{years}
					{sex}
					{pseudonyms}
				</h2>
			</header>
		);
	}
}

export default AuthorHeader;