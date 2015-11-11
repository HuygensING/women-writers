import React from "react";

class SaveFooter extends React.Component {
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
	onDelete: React.PropTypes.func,
	onSave: React.PropTypes.func,
	type: React.PropTypes.oneOf(["author", "publication", "collective"])
};

export default SaveFooter;