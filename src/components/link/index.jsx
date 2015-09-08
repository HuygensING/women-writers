import React from "react";
// import router from "../../router";

class Link extends React.Component {
	render() {
		return (
			<span
				className="link"
				onClick={() =>
					this.props.onNavigate(this.props.href)
				}>
				{this.props.value}
			</span>
		);
	}
}

export default Link;