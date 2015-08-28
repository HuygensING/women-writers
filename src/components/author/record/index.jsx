import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Personal from "./personal";
import Public from "./public";
import Publications from "./publications";
import Links from "../../links";

class AuthorRecord extends React.Component {
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
		this.props.router.navigate(`/persons/${this.props.id}/${label.toLowerCase()}`);

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
					<BasicInfo value={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Old ID</label>
								<span>{this.props.author.get("tempOldId")}</span>
							</li>
							<li>
								<label>Name</label>
								<span>{this.props.author.get("tempName")}</span>
							</li>
							<li>
								<label>Spouse</label>
								<span>{this.props.author.get("tempSpouse")}</span>
							</li>
							<li>
								<label>Pseudonyms</label>
								<span>{this.props.author.get("tempPseudonyms")}</span>
							</li>
							<li>
								<label>Birth Place</label>
								<span>{this.props.author.get("tempBirthPlace")}</span>
							</li>
							<li>
								<label>Place Of Birth</label>
								<span>{this.props.author.get("tempPlaceOfBirth")}</span>
							</li>
							<li>
								<label>Death Place</label>
								<span>{this.props.author.get("tempDeathPlace")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Personal"}
					label="Personal">
					<Personal value={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Spouse</label>
								<span>{this.props.author.get("tempSpouse")}</span>
							</li>
							<li>
								<label>Children</label>
								<span>{this.props.author.get("tempChildren")}</span>
							</li>
							<li>
								<label>Ps Children</label>
								<span>{this.props.author.get("tempPsChildren")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Public"}
					label="Public">
					<Public value={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Financial situation</label>
								<span>{this.props.author.get("tempFinancialSituation")}</span>
							</li>
							<li>
								<label>Collaborations</label>
								<span>{this.props.author.get("tempCollaborations")}</span>
							</li>
							<li>
								<label>Memberships</label>
								<span>{this.props.author.get("tempMemberships")}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.state.activeTab === "Publications"}
					label="Publications">
					<Publications value={this.props.author} />
				</Tab>
				<Tab
					active={this.state.activeTab === "Links"}
					label="Links">
					<Links values={this.props.author.get("links").toJS()} />
				</Tab>
			</Tabs>
		);
	}
}

AuthorRecord.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "links"])
};

export default AuthorRecord;