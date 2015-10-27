import React from "react";

import authorActions from "../../actions/author";
import publicationActions from "../../actions/publication";

let actions = {
	author: authorActions,
	publication: publicationActions
};

class SaveFooter extends React.Component {
	// handleDelete() {
	// 	let method = "delete" + this.props.type.charAt(0).toUpperCase() + this.props.type.substr(1);
	// 	actions[this.props.type][method]();
	// }

	// handleSave() {
	// 	let method = "save" + this.props.type.charAt(0).toUpperCase() + this.props.type.substr(1);
	// 	actions[this.props.type][method]();
	// }

	render() {
		return (
			<footer>
				<button className="cancel" onClick={this.props.onCancel}>Cancel</button>
				<button className="delete" onClick={this.props.onDelete}>Delete</button>
				<button className="save" onClick={this.props.onSave}>Save</button>
			</footer>
		);
	}
}

SaveFooter.propTypes = {
	onCancel: React.PropTypes.func,
	type: React.PropTypes.oneOf(["author", "publication"])
};

export default SaveFooter;