import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
// import LinkForm from "../edit-link";

import actions from "../../actions/publication";
import publicationStore from "../../stores/publication";

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
		this.setState(publicationStore.getState());
	}

	handleTabChange(label) {
		this.setState({
			activeTab: label
		});
	}

	render() {
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic Info"}
					label="Basic Info">
					<BasicInfo
						value={this.state.publication} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Creator</label>
								<span>{this.state.publication.get("tempCreator")}</span>
							</li>
							<li>
								<label>Language</label>
								<span>{this.state.publication.get("tempLanguage")}</span>
							</li>
							<li>
								<label>Origin</label>
								<span>{this.state.publication.get("tempOrigin")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				{/*
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
				*/}
				{/* Receptions */}
			</Tabs>
		);
	}
}

PublicationController.propTypes = {
	id: React.PropTypes.string
};

export default PublicationController;