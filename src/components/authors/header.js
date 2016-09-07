import React from "react";
import { urls } from "../../router";
import { Link }from "react-router";

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
		if (model.gender === "FEMALE") {
			sex = <small className="gender" >♀</small>;
		} else if (model.gender === "MALE") {
			sex = <small className="gender">♂</small>;
		}

		let pseudonyms, isPseudonymOf;
		if (model["@relations"].hasOwnProperty("hasPseudonym") && model["@relations"].hasPseudonym.length) {
			pseudonyms = (
				<small className="pseudonyms">
					Pseudonyms
					{model["@relations"].hasPseudonym.map((x, i) => (
						<Link to={urls.authorIndex(x.id)} key={i}>{x.displayName}</Link>
					))}
				</small>
			);
		}
		if (model["@relations"].hasOwnProperty("isPseudonymOf") && model["@relations"].isPseudonymOf.length) {
			pseudonyms = (
				<small className="pseudonyms">
					Is pseudonym of
					{model["@relations"].isPseudonymOf.map((x, i) => (
						<Link to={urls.authorIndex(x.id)} key={i}>{x.displayName}</Link>
					))}
				</small>
			);
		}
		return (
			<header className="page">
				<h2 title={name} className="m-b-0">
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
	author: React.PropTypes.object
};

export default AuthorHeader;