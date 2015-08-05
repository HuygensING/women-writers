import React from "react";
import router from "../../router";

class Link extends React.Component {
	handleClick() {
		router.navigate(this.props.href);
	}

	render() {
		return (
			<span
				className="link"
				onClick={this.handleClick.bind(this)}>
				{this.props.value}
			</span>
		);
	}
}

export default Link;