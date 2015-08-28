import React from "react";

import RelationAuthor from "../../values/relation-person";

class AuthorHeader extends React.Component {
	render() {
		let model = this.props.author;

		let name = model.get("names").reduce((str, current) => {
			if (str !== "") {
				str = str + "; ";
			}

			return str + current.get("firstName") + " " + current.get("lastName");
		}, "");

		let birthYear = model.get("birthDate") === "" ?
			"?" :
			model.get("birthDate");

		let deathYear = model.get("deathDate") === "" ?
			"?" :
			model.get("deathDate");

		let years = (birthYear === "?" && deathYear === "?") ?
			null :
			<small className="years">({birthYear} - {deathYear})</small>;

		let sex;
		if (model.get("gender") === "Female") {
			sex = <small>♀</small>;
		} else if (model.get("gender") === "Male") {
			sex = <small>♂</small>;
		}

		let pseudonyms;
		if (model.get("@relations").get("hasPseudonym").size) {
			pseudonyms = (
				<small className="pseudonyms">
					Pseudonyms
					<RelationAuthor values={model.get("@relations").get("hasPseudonym").toJS()} />
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