import React from "react";

class Relation extends React.Component {
	render() {
		let values = (this.props.values.length) ?
			<ul className="relation">{this.props.values.map((v, index) => <li key={index}>{v.value} {v.date ? `(${v.date})` : null}</li>)}</ul> :
			"-";

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