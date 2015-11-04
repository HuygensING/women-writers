import React from "react";
import RefreshIcon from "../icons/refresh";

class EditButton extends React.Component {

	render() {
		let show = this.props.user != null && this.props.user.token != null && this.props.model["^pid"] != null;

		let alt = this.props.model["^pid"] ?
			null :
			<div className="button-edit hire-empty-list">
				Unable to edit. <button className="refresh-button" onClick={this.props.onRefresh}><RefreshIcon /></button> <br />
				No persistent ID found.
			</div>;

		return show ?
			<button
				className="edit"
				onClick={this.props.onToggleEdit.bind(this, true)}>
				Edit
			</button> :
			alt;
	}
}

EditButton.propTypes = {
	model: React.PropTypes.object,
	onRefresh: React.PropTypes.func,
	onToggleEdit: React.PropTypes.func,
	user: React.PropTypes.object
};

EditButton.defaultProps = {
	model: {},
	user: null
};

export default EditButton;