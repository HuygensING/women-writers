import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import PersonalForm from "./personal";
import PublicForm from "./public";
import LinkForm from "./link";

import actions from "../actions/author";
import authorStore from "../stores/author";

class AuthorController extends React.Component {
	constructor(props) {
		super(props);

		this.state = Object.assign(authorStore.getState(), {
			activeTab: "Basic Info"
		});
	}

	componentDidMount() {
		actions.getAuthor(this.props.id);
		authorStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		authorStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(authorStore.getState());
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
						value={this.state.author} />
				</Tab>
				{/* Works */}
				<Tab
					active={this.state.activeTab === "Personal"}
					label="Personal">
					<PersonalForm
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						value={this.state.author} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Public"}
					label="Public">
					<PublicForm
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						value={this.state.author} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<MultiForm
						attr={"links"}
						component = {LinkForm}
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						values={this.state.author.get("links")} />
				</Tab>
				{/* Links */}
			</Tabs>
		);
	}
}

AuthorController.propTypes = {
	id: React.PropTypes.string
};

export default AuthorController;