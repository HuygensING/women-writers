import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import LinkForm from "../author/link";

import actions from "../actions/publication";
import publicationStore from "../stores/publication";

class PublicationController extends React.Component {
	constructor(props) {
		super(props);

		this.state = Object.assign(
			publicationStore.getState(),
			{
				activeTab: "Basic Info"
			}
		);
	}

	componentDidMount() {
		actions.getPublication(this.props.id);
		publicationStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		publicationStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		let state = Object.assign(publicationStore.getState());
		this.setState(state);
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
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<MultiForm
						attr={"links"}
						component = {LinkForm}
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						values={this.state.publication.get("links")} />
				</Tab>
				{/* Receptions */}
			</Tabs>
		);
	}
}

export default PublicationController;