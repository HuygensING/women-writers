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

		let activeTab = (props.tab != null) ?
			props.tab.charAt(0).toUpperCase() + props.tab.substr(1) :
			"Basic info";

		this.state = Object.assign(
			publicationStore.getState(),
			userStore.getState(),
			{
				activeTab: activeTab
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

	handleTabChange(label) {
		router.navigate(`/documents/${this.props.id}/${label.toLowerCase()}`);

		this.setState({
			activeTab: label
		});
	}

	handleEditButtonClick() {
		this.setState({
			edit: true
		});

		router.navigate(`documents/${this.state.publication.get("_id")}/edit`);
	}

	handleFooterCancel() {
		this.setState({
			edit: false
		});

		router.navigate(`documents/${this.state.publication.get("_id")}`);
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
				router={router} /> :
			<PublicationRecord
				{...this.props}
				publication={this.state.publication}
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
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"])
};

export default PublicationController;