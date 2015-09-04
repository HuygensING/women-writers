import React from "react";

class EditButton {
	render() {
		let show = this.props.token != null && this.props.pid != null;

		let alt = this.props.pid ?
			null :
			<div className="button-edit hire-empty-list">
				Unable to edit.<br />
				No persistent ID found.
			</div>;

		return show ?
			<button
				className="edit"
				onClick={this.props.onClick}>
				Edit
			</button> :
			alt;
	}
}

export default EditButton;