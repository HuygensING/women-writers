import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import PersonalForm from "./personal";
import PublicForm from "./public";
import LinkForm from "../edit-link";
import SaveFooter from "../save-footer";

import actions from "../../actions/author";
import authorStore from "../../stores/author";

class AuthorEditController extends React.Component {
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
			<div className="edit-author">
				<Tabs onChange={this.handleTabChange.bind(this)}>
					<Tab
						active={this.state.activeTab === "Basic Info"}
						label="Basic Info">
						<BasicInfoForm
							onChange={this.handleFormChange}
							onDelete={this.handleFormDelete}
							value={this.state.author} />
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
					{/* Works */}
					<Tab
						active={this.state.activeTab === "Personal"}
						label="Personal">
						<PersonalForm
							onChange={this.handleFormChange}
							onDelete={this.handleFormDelete}
							value={this.state.author} />
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
						<PublicForm
							onChange={this.handleFormChange}
							onDelete={this.handleFormDelete}
							value={this.state.author} />
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
				<SaveFooter type="author" />
			</div>
		);
	}
}

AuthorEditController.propTypes = {
	id: React.PropTypes.string
};

export default AuthorEditController;