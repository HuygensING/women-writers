import React from "react";
import {Tabs, Tab} from "hire-tabs";

import router from "../../router";

import BasicInfo from "./basic-info";
import Personal from "./personal";
import Public from "./public";
import Publications from "./publications";
import Links from "../links";
import EditButton from "../edit-button";

import actions from "../../actions/author";
import authorStore from "../../stores/author";
import userStore from "../../stores/user";

class AuthorController extends React.Component {
	constructor(props) {
		super(props);

		let activeTab = (props.tab != null) ?
			props.tab.charAt(0).toUpperCase() + props.tab.substr(1) :
			"Basic info";

		this.state = Object.assign(
			authorStore.getState(),
			userStore.getState(),
			{
				activeTab: activeTab
			});
	}

	componentDidMount() {
		actions.getAuthor(this.props.id);
		authorStore.listen(this.onStoreChange.bind(this));
		userStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		authorStore.stopListening(this.onStoreChange.bind(this));
		userStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		let state = Object.assign(authorStore.getState(), userStore.getState());

		this.setState(state);
	}

	handleTabChange(label) {
		router.navigate(`/persons/${this.props.id}/${label.toLowerCase()}`);

		this.setState({
			activeTab: label
		});
	}

	goToEditPage() {
		let url = window.location.pathname + "/edit";
		window.location.assign(url);
	}

	render() {
		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic info"}
					label="Basic info">
					<BasicInfo value={this.state.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Old ID</label>
								<span>{this.state.author.get("tempOldId")}</span>
							</li>
							<li>
								<label>Name</label>
								<span>{this.state.author.get("tempName")}</span>
							</li>
							<li>
								<label>Spouse</label>
								<span>{this.state.author.get("tempSpouse")}</span>
							</li>
							<li>
								<label>Pseudonyms</label>
								<span>{this.state.author.get("tempPseudonyms")}</span>
							</li>
							<li>
								<label>Birth Place</label>
								<span>{this.state.author.get("tempBirthPlace")}</span>
							</li>
							<li>
								<label>Place Of Birth</label>
								<span>{this.state.author.get("tempPlaceOfBirth")}</span>
							</li>
							<li>
								<label>Death Place</label>
								<span>{this.state.author.get("tempDeathPlace")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Personal"}
					label="Personal">
					<Personal value={this.state.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Spouse</label>
								<span>{this.state.author.get("tempSpouse")}</span>
							</li>
							<li>
								<label>Children</label>
								<span>{this.state.author.get("tempChildren")}</span>
							</li>
							<li>
								<label>Ps Children</label>
								<span>{this.state.author.get("tempPsChildren")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Public"}
					label="Public">
					<Public value={this.state.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Financial situation</label>
								<span>{this.state.author.get("tempFinancialSituation")}</span>
							</li>
							<li>
								<label>Collaborations</label>
								<span>{this.state.author.get("tempCollaborations")}</span>
							</li>
							<li>
								<label>Memberships</label>
								<span>{this.state.author.get("tempMemberships")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Publications"}
					label="Publications">
					<Publications value={this.state.author} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<Links values={this.state.author.get("links").toJS()} />
				</Tab>
				<EditButton
					pid={this.state.author.get("^pid")}
					token={this.state.user.get("token")} />
			</Tabs>
		);
	}
}

AuthorController.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "links"])
};

export default AuthorController;