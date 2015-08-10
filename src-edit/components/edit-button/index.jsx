import React from "react";
import router from "../../router";

class EditButton {
	goToEditPage() {
		let url = window.location.pathname.split("/").slice(2, 4);

		url.push("edit");
		router.navigate(url.join("/"));
	}

	render() {
		let show = this.props.token != null && this.props.pid != null;

		return show ?
			<button onClick={this.goToEditPage.bind(this)}>Edit</button> :
			null;
	}
}

export default EditButton;