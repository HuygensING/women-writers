import React from "react";
import router from "../../router";

class EditButton {
	goToEditPage() {
		let url = window.location.pathname.split("/").slice(2, 4);
		console.log(url);
		url.push("edit");
		router.navigate(url.join("/"));
	}

	render() {
		let show = localStorage.getItem("hi-womenwriters-auth-token") != null && this.props.pid != null;

		return show ?
			<button onClick={this.goToEditPage.bind(this)}>Edit</button> :
			null;
	}
}

export default EditButton;