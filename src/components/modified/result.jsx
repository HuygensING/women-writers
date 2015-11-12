import React from "react";

class ModifiedResult extends React.Component {

	onSelect() {
		let path = this.props.data.data.title ? "documents" : "persons";
		this.props.onSelect({path: path + "/" + this.props.data.data._id});
	}

	render() {
		return <li onClick={this.onSelect.bind(this)}>{this.props.data.data.title || this.props.data.displayName}</li>;
	}
}

ModifiedResult.propTypes = {
	data: React.PropTypes.object,
	onSelect: React.PropTypes.func
};


export default ModifiedResult;