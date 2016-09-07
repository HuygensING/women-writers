import React from "react";
import cx from "classnames";


class Text extends React.Component {
	render() {
		const otherValue = this.props.otherValue === "" || !this.props.otherValue ?
			null :
			this.props.otherValue;

		const value = (this.props.value === "") ?
			"-" :
			this.props.value;

		return (
			<span style={{whiteSpace: "pre-wrap"}}>
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

Text.propTypes = {
	value: React.PropTypes.string
};

Text.defaultProps = {
	value: ""
};

export default Text;