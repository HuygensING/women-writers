import React from "react";

import PublicationHeader from "./header";
import EditButton from "../edit-button";
import PublicationRecord from "./record";
import PublicatioFnorm from "./form";
import SaveFooter from "../save-footer";

import actions from "../../actions/publication";
import publicationStore from "../../stores/publication";
import userStore from "../../stores/user";

import router from "../../router";

class PublicationController extends React.Component {
	constructor(props) {
		super(props);

		this.onStoreChange = this.onStoreChange.bind(this);

		this.state = Object.assign(
			publicationStore.getState(),
			userStore.getState(), {
				edit: this.props.edit
			});
	}

	componentDidMount() {
		actions.getPublication(this.props.id);
		publicationStore.listen(this.onStoreChange);
		userStore.listen(this.onStoreChange);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			actions.getPublication(nextProps.id);
		}
	}

	componentWillUnmount() {
		publicationStore.stopListening(this.onStoreChange);
		userStore.stopListening(this.onStoreChange);
	}

	onStoreChange() {
		let state = Object.assign(publicationStore.getState(), userStore.getState());

		this.setState(state);
	}

	handleEditButtonClick() {
		this.setState({
			edit: true
		});

		let id = this.state.publication.get("_id");
		let tab = this.refs.publicationRecord.state.activeTab.toLowerCase();
		let path = `documents/${id}/${tab}/edit`;
		router.navigate(path);
	}

	handleFooterCancel() {
		this.setState({
			edit: false
		});

		let id = this.state.publication.get("_id");
		let tab = this.refs.publicationForm.state.activeTab.toLowerCase();
		let path = `documents/${id}/${tab}`;
		router.navigate(path);
	}

	render() {
		let editButton = (this.state.edit) ?
			null :
			<EditButton
				onClick={this.handleEditButtonClick.bind(this)}
				pid={this.state.publication.get("^pid")}
				token={this.state.user.get("token")} />;

		let body = (this.state.edit) ?
			<PublicatioFnorm
				{...this.props}
				publication={this.state.publication}
				ref="publicationForm"
				router={router} /> :
			<PublicationRecord
				{...this.props}
				publication={this.state.publication}
				ref="publicationRecord"
				router={router} />;

		let footer = (this.state.edit) ?
			<SaveFooter
				onCancel={this.handleFooterCancel.bind(this)}
				type="publication" /> :
			null;

		return (
			<div className="publication">
				<PublicationHeader
					publication={this.state.publication} />
				{editButton}
				{body}
				{footer}
			</div>
		);
	}
}

PublicationController.propTypes = {
	edit: React.PropTypes.bool,
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"])
};

PublicationController.defaultProps = {
	edit: false,
	tab: "basic info"
};

export default PublicationController;