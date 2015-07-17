import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfoForm from "./basic-info";

import actions from "./actions";
import store from "./store";

class PersonForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = Object.assign(store.getState(), {
			activeTab: "Basic Info"
		});
	}

	componentDidMount() {
		store.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		store.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(store.getState());
	}

	handleTabChange(label) {
		this.setState({
			activeTab: label
		});
	}

	handleFormChange(key, value) {
		actions.setKey(key, value);
	}

	render() {
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic Info"}
					label="Basic Info">
					<BasicInfoForm
						onChange={this.handleFormChange}
						value={this.state.person} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Works"}
					label="Works">
					<div>WORKS</div>
				</Tab>
			</Tabs>
		);
	}
}

export default PersonForm;