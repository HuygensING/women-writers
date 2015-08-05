import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Receptions from "./receptions";
// import LinkForm from "../edit-link";
import Links from "../links";
import EditButton from "../edit-button";

import actions from "../../actions/publication";
import publicationStore from "../../stores/publication";

import router from "../../router";

class PublicationController extends React.Component {
	constructor(props) {
		super(props);

		this.state = Object.assign(
			publicationStore.getState(),
			{
				activeTab: "Basic info"
			}
		);
	}

	componentDidMount() {
		actions.getPublication(this.props.id);
		publicationStore.listen(this.onStoreChange.bind(this));
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			actions.getPublication(nextProps.id);
		}
	}

	componentWillUnmount() {
		publicationStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(publicationStore.getState());
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
					active={this.state.activeTab === "Links"}
					label="Links">
					<Links values={this.state.publication.get("links").toJS()} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Receptions"}
					label="Receptions">
					<Receptions value={this.state.publication} />
				</Tab>
				{/* Receptions */}
				<EditButton pid={this.state.publication.get("^pid")} />
			</Tabs>
		);
	}
}

PublicationController.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.string
};

export default PublicationController;