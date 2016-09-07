import React from "react";
import cx from "classnames";

class Str extends React.Component {
	render() {
		const otherValue = this.props.otherValue === "" || !this.props.otherValue ?
			null :
			this.props.otherValue;

		const value = (this.props.value === "") ?
			"-" :
			this.props.value;

		return (
			<span>
				<span className={cx({"other-data-list": otherValue})}>
					{value}
				</span>
				<span className={cx({"other-data": otherValue, "other-data-list": otherValue})}>
					{otherValue}
				</span>
			</span>
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