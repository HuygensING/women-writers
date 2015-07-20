import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfoForm from "./basic-info";

import actions from "../actions/publication";
import publicationStore from "../stores/publication";

class PublicationController extends React.Component {
	constructor(props) {
		super(props);

		this.state = Object.assign(publicationStore.getState(), {
			activeTab: "Basic Info"
		});
	}

	componentDidMount() {
		publicationStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		publicationStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(publicationStore.getState());
	}

	handleTabChange(label) {
		this.setState({
			activeTab: label
		});
	}

	handleFormChange(key, value) {
		actions.setKey(key, value);
	}

	handleFormDelete(key) {
		actions.deleteKey(key);
	}

	render() {
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic Info"}
					label="Basic Info">
					<BasicInfoForm
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						value={this.state.publication} />
				</Tab>
				{/* Links */}
				{/* Receptions */}
			</Tabs>
		);
	}
}

export default PublicationController;