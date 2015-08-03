import React from "react";

class Relation extends React.Component {
	render() {
		let values;

		if (this.props.values.length)	{
			values = <ul className="relation">{this.props.values.map((v) => <li>{v.value}</li>)}</ul>;
		} else {
			values = "-";
		}

		return (
			<span>{values}</span>
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