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
				<button className="btn btn-default" onClick={this.props.onCancel}>Cancel</button>
				<button className="btn btn-default pull-right" onClick={this.props.onSave}>Save</button>
				<button className="btn btn-danger pull-right" onClick={this.confirmDelete.bind(this)}>Delete</button>
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