import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Personal from "./personal";
import Public from "./public";
import Publications from "./publications";
import Links from "../../links";

class AuthorRecord extends React.Component {
	// constructor(props) {
	// 	super(props);

	// 	let activeTab = (props.tab != null) ?
	// 		props.tab.charAt(0).toUpperCase() + props.tab.substr(1) :
	// 		"Basic info";

	// 	this.state = {
	// 		activeTab: activeTab
	// 	};
	// }

	// handleTabChange(label) {
	// 	this.props.router.navigate(`/persons/${this.props.id}/${label.toLowerCase()}`);

	// 	this.setState({
	// 		activeTab: label
	// 	});
	// }

	render() {
		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<BasicInfo author={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Old ID</label>
								<span>{this.props.author.tempOldId}</span>
							</li>
							<li>
								<label>Name</label>
								<span>{this.props.author.tempName}</span>
							</li>
							<li>
								<label>Spouse</label>
								<span>{this.props.author.tempSpouse}</span>
							</li>
							<li>
								<label>Pseudonyms</label>
								<span>{this.props.author.tempPseudonyms}</span>
							</li>
							<li>
								<label>Birth Place</label>
								<span>{this.props.author.tempBirthPlace}</span>
							</li>
							<li>
								<label>Place Of Birth</label>
								<span>{this.props.author.tempPlaceOfBirth}</span>
							</li>
							<li>
								<label>Death Place</label>
								<span>{this.props.author.tempDeathPlace}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.props.tab === "personal"}
					label="Personal">
					<Personal author={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Spouse</label>
								<span>{this.props.author.tempSpouse}</span>
							</li>
							<li>
								<label>Children</label>
								<span>{this.props.author.tempChildren}</span>
							</li>
							<li>
								<label>Ps Children</label>
								<span>{this.props.author.tempPsChildren}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.props.tab === "public"}
					label="Public">
					<Public author={this.props.author} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Financial situation</label>
								<span>{this.props.author.tempFinancialSituation}</span>
							</li>
							<li>
								<label>Collaborations</label>
								<span>{this.props.author.tempCollaborations}</span>
							</li>
							<li>
								<label>Memberships</label>
								<span>{this.props.author.tempMemberships}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.props.tab === "publications"}
					label="Publications">
					<Publications
						author={this.props.author}
						relations={this.props.relations} />
				</Tab>
				<Tab
					active={this.props.tab === "links"}
					label="Links">
					<Links values={this.props.author.links} />
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