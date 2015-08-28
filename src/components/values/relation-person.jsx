import React from "react";
import Link from "../link";

class PersonRelation extends React.Component {
	render() {
		if (!this.props.values.length) {
			return <span>-</span>;
		}

		let relations = this.props.values.map((v, index) =>
			<li key={index}>
				<Link
					href={`/persons/${v.key.substr(v.key.lastIndexOf("/") + 1)}`}
					value={v.value} />
			</li>
		)

		return (
			<span>
				<ul className="relation person-relation">
					{relations}
				</ul>
			</span>
		);
	}
}

PersonRelation.propTypes = {
	values: React.PropTypes.array
};

PersonRelation.defaultProps = {
	values: []
};

export default PersonRelation;