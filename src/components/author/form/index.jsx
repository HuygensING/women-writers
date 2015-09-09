import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import PersonalForm from "./personal";
import PublicForm from "./public";
import PublicationsForm from "./publications";
import LinkForm from "../../edit-link";

class AuthorForm extends React.Component {
	render() {
		let model = this.props.author;

		let personalTab = (model._id == null) ?
			null :
			<Tab
				active={this.props.tab === "personal"}
				label="Personal">
				<PersonalForm
					onChange={this.props.onFormChange}
					onDelete={this.props.onFormDelete}
					author={model} />
				<div className="temp-data">
					<h2>Temporary data</h2>
					<ul>
						<li>
							<label>Spouse</label>
							<span>{model.tempSpouse}</span>
						</li>
						<li>
							<label>Children</label>
							<span>{model.tempChildren}</span>
						</li>
						<li>
							<label>Ps Children</label>
							<span>{model.tempPsChildren}</span>
						</li>
					</ul>
				</div>
			</Tab>;

		let publicTab = (model._id == null) ?
			null :
			<Tab
				active={this.props.tab === "public"}
				label="Public">
				<PublicForm
					onChange={this.props.onFormChange}
					onDelete={this.props.onFormDelete}
					author={model} />
				<div className="temp-data">
					<h2>Temporary data</h2>
					<ul>
						<li>
							<label>Financial situation</label>
							<span>{model.tempFinancialSituation}</span>
						</li>
						<li>
							<label>Collaborations</label>
							<span>{model.tempCollaborations}</span>
						</li>
						<li>
							<label>Memberships</label>
							<span>{model.tempMemberships}</span>
						</li>
					</ul>
				</div>
			</Tab>;

		let publicationsTab = (model._id == null) ?
			null :
			<Tab
				active={this.props.tab === "publications"}
				label="Publications">
				<PublicationsForm
					onChange={this.props.onFormChange}
					onDelete={this.props.onFormDelete}
					onNavigate={this.props.onNavigate}
					relations={this.props.relations}
					author={model} />
			</Tab>;

		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<BasicInfoForm
						onChange={this.props.onFormChange}
						onDelete={this.props.onFormDelete}
						author={model} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Old ID</label>
								<span>{model.tempOldId}</span>
							</li>
							<li>
								<label>Name</label>
								<span>{model.tempName}</span>
							</li>
							<li>
								<label>Spouse</label>
								<span>{model.tempSpouse}</span>
							</li>
							<li>
								<label>Pseudonyms</label>
								<span>{model.tempPseudonyms}</span>
							</li>
							<li>
								<label>Birth Place</label>
								<span>{model.tempBirthPlace}</span>
							</li>
							<li>
								<label>Place Of Birth</label>
								<span>{model.tempPlaceOfBirth}</span>
							</li>
							<li>
								<label>Death Place</label>
								<span>{model.tempDeathPlace}</span>
							</li>
						</ul>
					</div>
				</Tab>
				{personalTab}
				{publicTab}
				{publicationsTab}
				<Tab
					active={this.props.tab === "links"}
					label="Links">
					<MultiForm
						attr={"links"}
						component = {LinkForm}
						model={{
							label: "",
							url: ""
						}}
						onChange={this.props.onFormChange}
						onDelete={this.props.onFormDelete}
						values={model.links} />
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