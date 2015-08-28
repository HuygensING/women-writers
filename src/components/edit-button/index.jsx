import React from "react";

class EditButton {
	render() {
		let show = this.props.token != null && this.props.pid != null;

		return show ?
			<button
				className="edit"
				onClick={this.props.onClick}>
				Edit
			</button> :
			null;
	}
}

export default EditButton;