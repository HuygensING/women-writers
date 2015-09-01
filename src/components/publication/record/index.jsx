import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Receptions from "./receptions";
// import LinkForm from "../../edit-link";
import Links from "../../links";
import EditButton from "../../edit-button";

import actions from "../../../actions/publication";
import publicationStore from "../../../stores/publication";
import userStore from "../../../stores/user";

import router from "../../../router";

class PublicationRecord extends React.Component {
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

	render() {
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic info"}
					label="Basic info">
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
				<Tab
					active={this.state.activeTab === "Receptions"}
					label="Receptions">
					<Receptions value={this.state.publication} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<Links values={this.state.publication.get("links").toJS()} />
				</Tab>
			</Tabs>
		);
	}
}

PublicationRecord.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"])
};

export default PublicationRecord;