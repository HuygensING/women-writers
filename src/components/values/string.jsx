import React from "react";

class Str extends React.Component {
	render() {
		let value = (this.props.value === "") ?
			"-" :
			this.props.value;

		return (
			<span>{value}</span>
		);
	}
}

Str.propTypes = {
	value: React.PropTypes.string
};

Str.defaultProps = {
	value: ""
};

export default Str;