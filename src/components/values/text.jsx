import React from "react";

class Text extends React.Component {
	render() {
		let value = (this.props.value === "") ?
			"-" :
			this.props.value;

		return (
			<span style={{whiteSpace: "pre-wrap"}}>{value}</span>
		);
	}
}

Text.propTypes = {
	value: React.PropTypes.string
};

Text.defaultProps = {
	value: ""
};

export default Text;