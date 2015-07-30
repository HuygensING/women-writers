import React from "react";

class Relation extends React.Component {
	render() {
		console.log("V", this.props.values, this.props.values.length);
		// let value = (this.props.value.length > 0) ?
		// 	this.props.value.map((v) => v.value).join(", ") :
		// 	"-";
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
}

Relation.defaultProps = {
	values: []
}

export default Relation;