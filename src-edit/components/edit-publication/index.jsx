// TODO NewButton should have a select first, to choose
// what kind of author. The select should only be visible if the the
// parent is saved (has an _id prop).

import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import LinkForm from "../edit-link";
import NewButton from "../new-button";
import SaveFooter from "../save-footer";

import actions from "../../actions/publication";
import publicationStore from "../../stores/publication";

class PublicationEditController extends React.Component {
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

	handleFormChange(key, value) {
		actions.setKey(key, value);
	}

	handleFormDelete(key) {
		actions.deleteKey(key);
	}

	render() {
		let model = this.state.publication;

		return (
			<div className="edit-publication">
				<Tabs onChange={this.handleTabChange.bind(this)}>
					<Tab
						active={this.state.activeTab === "Basic Info"}
						label="Basic Info">
						<BasicInfoForm
							onChange={this.handleFormChange}
							onDelete={this.handleFormDelete}
							value={model} />
						<div className="temp-data">
							<h2>Temporary data</h2>
							<ul>
								<li>
									<label>Creator</label>
									<span>{model.get("tempCreator")}</span>
								</li>
								<li>
									<label>Language</label>
									<span>{model.get("tempLanguage")}</span>
								</li>
								<li>
									<label>Origin</label>
									<span>{model.get("tempOrigin")}</span>
								</li>
							</ul>
						</div>
					</Tab>
					<Tab
						active={this.state.activeTab === "Links"}
						label="Links">
						<MultiForm
							attr={"links"}
							component = {LinkForm}
							onChange={this.handleFormChange}
							onDelete={this.handleFormDelete}
							values={model.get("links")} />
					</Tab>
					{/* Receptions */}
					{/*
						<NewButton
							key={model.get("_id")}
							type="author"
							value={model.get("title")} />
					*/}
				</Tabs>
				<SaveFooter type="publication" />
			</div>
		);
	}
}

PublicationEditController.propTypes = {
	id: React.PropTypes.string
};

export default PublicationEditController;