import React from "react";
// import router from "../../router";

class Link extends React.Component {
	render() {
		return (
			<span
				className={"link " + (this.props.className ? this.props.className : "")}
				onClick={() =>
					this.props.onNavigate(this.props.href)
				}>
				{this.props.value}
			</span>
		);
	}
}

Link.propTypes = {
	className: React.PropTypes.string,
	href: React.PropTypes.string,
	onNavigate: React.PropTypes.func,
	value: React.PropTypes.string
};

export default Link;