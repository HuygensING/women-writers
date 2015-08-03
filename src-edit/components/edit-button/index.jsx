import React from "react";

class EditButton {
	goToEditPage() {
		let url = window.location.pathname + "/edit";
		window.location.assign(url);
	}

	render() {
		let show = localStorage.getItem("hi-womenwriters-auth-token") != null && this.props["pid"] != null;

		return show ?
			<button onClick={this.goToEditPage.bind(this)}>Edit</button> :
			null;
	}
}

export default EditButton;