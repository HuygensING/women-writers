import React from "react";
import Immutable from "immutable";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import PersonalForm from "./personal";
import PublicForm from "./public";
import PublicationsForm from "./publications";
import LinkForm from "../../edit-link";

import actions from "../../../actions/author";

class AuthorForm extends React.Component {
	constructor(props) {
		super(props);

		let activeTab = (props.tab != null) ?
			props.tab.charAt(0).toUpperCase() + props.tab.substr(1) :
			"Basic info";

		this.state = {
			activeTab: activeTab
		};
	}

	handleTabChange(label) {
		let id = (this.props.id != null) ?
			this.props.id :
			"new";

		this.props.router.navigate(`/persons/${id}/${label.toLowerCase()}/edit`);

		this.setState({
			activeTab: label
		});
	}

	handleFormChange(key, value) {
		if (key[0] === "links" || key[0] === "names") {
			value = Immutable.fromJS(value);
		}

		actions.setKey(key, value);
	}

	handleFormDelete(key) {
		actions.deleteKey(key);
	}

	render() {
		let model = this.props.author;

		let authorName = model.get("names").size ?
			`${model.get("names").get(0).get("lastName")}, ${model.get("names").get(0).get("firstName")}` :
			null;

		let personalTab = (model.get("_id") == null) ?
			null :
			<Tab
				active={this.state.activeTab === "Personal"}
				label="Personal">
				<PersonalForm
					onChange={this.handleFormChange}
					onDelete={this.handleFormDelete}
					value={model} />
				<div className="temp-data">
					<h2>Temporary data</h2>
					<ul>
						<li>
							<label>Spouse</label>
							<span>{model.get("tempSpouse")}</span>
						</li>
						<li>
							<label>Children</label>
							<span>{model.get("tempChildren")}</span>
						</li>
						<li>
							<label>Ps Children</label>
							<span>{model.get("tempPsChildren")}</span>
						</li>
					</ul>
				</div>
			</Tab>;

		let publicTab = (model.get("_id") == null) ?
			null :
			<Tab
				active={this.state.activeTab === "Public"}
				label="Public">
				<PublicForm
					onChange={this.handleFormChange}
					onDelete={this.handleFormDelete}
					value={model} />
				<div className="temp-data">
					<h2>Temporary data</h2>
					<ul>
						<li>
							<label>Financial situation</label>
							<span>{model.get("tempFinancialSituation")}</span>
						</li>
						<li>
							<label>Collaborations</label>
							<span>{model.get("tempCollaborations")}</span>
						</li>
						<li>
							<label>Memberships</label>
							<span>{model.get("tempMemberships")}</span>
						</li>
					</ul>
				</div>
			</Tab>;

		let publicationsTab = (model.get("_id") == null) ?
			null :
			<Tab
				active={this.state.activeTab === "Publications"}
				label="Publications">
				<PublicationsForm
					onChange={this.handleFormChange}
					onDelete={this.handleFormDelete}
					value={model} />
			</Tab>;

		return (
			<Tabs onChange={this.handleTabChange.bind(this)}>
				<Tab
					active={this.state.activeTab === "Basic info"}
					label="Basic info">
					<BasicInfoForm
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						value={model} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Old ID</label>
								<span>{model.get("tempOldId")}</span>
							</li>
							<li>
								<label>Name</label>
								<span>{model.get("tempName")}</span>
							</li>
							<li>
								<label>Spouse</label>
								<span>{model.get("tempSpouse")}</span>
							</li>
							<li>
								<label>Pseudonyms</label>
								<span>{model.get("tempPseudonyms")}</span>
							</li>
							<li>
								<label>Birth Place</label>
								<span>{model.get("tempBirthPlace")}</span>
							</li>
							<li>
								<label>Place Of Birth</label>
								<span>{model.get("tempPlaceOfBirth")}</span>
							</li>
							<li>
								<label>Death Place</label>
								<span>{model.get("tempDeathPlace")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				{personalTab}
				{publicTab}
				{publicationsTab}
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<MultiForm
						attr={"links"}
						component = {LinkForm}
						model={{
							label: "",
							url: ""
						}}
						onChange={this.handleFormChange}
						onDelete={this.handleFormDelete}
						values={model.get("links").toJS()} />
				</Tab>
			</Tabs>
		);
	}
}

AuthorForm.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "links"])
};

export default AuthorForm;