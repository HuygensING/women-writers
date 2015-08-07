import React from "react";

import router from "../../router";

import authorActions from "../../actions/author";
import publicationActions from "../../actions/publication";

let actions = {
	author: authorActions,
	publication: publicationActions
};

class SaveFooter extends React.Component {
	handleCancel() {
		let url = (window.location.pathname.substr(-4) === "/new") ?
			window.location.pathname.split("/").slice(2, 3) :
			window.location.pathname.split("/").slice(2, 4);

		router.navigate(url.join("/"));
	}

	handleSave() {
		let method = "save" + this.props.type.charAt(0).toUpperCase() + this.props.type.substr(1);
		actions[this.props.type][method]();
	}

	render() {
		return (
			<footer>
				<button className="cancel" onClick={this.handleCancel.bind(this)}>Cancel</button>
				<button className="delete">Delete</button>
				<button className="save" onClick={this.handleSave.bind(this)}>Save</button>
			</footer>
		);
	}
}

SaveFooter.propTypes = {
	type: React.PropTypes.oneOf(["author", "publication"])
};

export default SaveFooter;