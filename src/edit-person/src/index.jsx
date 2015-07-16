import React from "react";
import {Tabs, Tab} from "hire-tabs";

class PersonForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: "basic-info"
		};
	}

	handleTabChange(label) {
		this.setState({
			activeTab: label
		});
	}

	render() {
		console.log(this.state.activeTab);
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic Info"}
					label="Basic Info">
					<div>BASIC</div>
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