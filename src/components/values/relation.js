import React from "react";
import cx from "classnames";

import { urls } from "../../router";
import { Link } from "react-router";


const genderMap = {
	"FEMALE": " ♀",
	"MALE": " ♂"
};


class Relation extends React.Component {
	render() {
		const { otherValues } = this.props;

		let values = (this.props.values.length) ?
			<ul className={cx("relation", {"other-data-list": otherValues})}>{this.props.values
				.sort((a, b) => a.displayName.localeCompare(b.displayName))
				.map((v, index) => this.props.linkTo ? (
				<li key={index}><Link to={urls[this.props.linkTo](v.id)}>{v.displayName}{v.gender ? genderMap[v.gender] : ""}</Link></li>
			)
				: (
				<li key={index}>{v.displayName}{v.gender ? genderMap[v.gender] : ""}</li>
			))}</ul> :
			<span className={cx({"other-data-list": otherValues})}>-</span>;

		let otherValueTags = null;
		if (otherValues) {
			otherValueTags = (<ul className={cx("relation", {"other-data-list": otherValues})}>{otherValues
				.sort((a, b) => a.displayName.localeCompare(b.displayName))
				.map((v, index) =>  <li key={index} className="other-data">{v.displayName}{v.gender ? genderMap[v.gender] : ""}</li>)}
			</ul>);
		}

		return (
			<span>{values}{otherValueTags}</span>
		);
	}
}

Relation.propTypes = {
	values: React.PropTypes.array
};

Relation.defaultProps = {
	values: []
};

export default Relation;