import React from "react";

class SaveFooter extends React.Component {

	confirmDelete() {
		if(confirm("Delete this record, are you sure?")) {
			this.props.onDelete();
		}
	}
	render() {
		return (
			<footer>
				<button className="cancel" onClick={this.props.onCancel}>Cancel</button>
				<button className="delete" onClick={this.confirmDelete.bind(this)}>Delete</button>
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