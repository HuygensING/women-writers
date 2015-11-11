import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Personal from "./personal";
import Public from "./public";
import RelationList from "../../relation-list";
import Links from "../../links";
import {hasRegularName} from "../util";
import VariationSelect from "../../values/variation-select";


class AuthorRecord extends React.Component {
	render() {
		let variationSelect = (this.props.author["@variationRefs"] || []).filter((v) => ["wwperson", "person"].indexOf(v.type) < 0) .length ?
			(<VariationSelect
				onSelectVariation={this.props.onSelectVariation}
				showVariation={this.props.showVariation}
				variationRefs={this.props.author["@variationRefs"]}
			/>) : null;

		let variationBasicComponent = this.props.variationData ? <BasicInfo author={this.props.variationData} onNavigate={this.props.onNavigate} /> : null;
		let variationPersonalComponent = this.props.variationData ? <Personal author={this.props.variationData} onNavigate={this.props.onNavigate} /> : null;
		let variationPublicComponent = this.props.variationData ? <Public author={this.props.variationData} onNavigate={this.props.onNavigate} /> : null;
		let variationPublicationsComponent = this.props.variationData ? (
			<RelationList
				model={this.props.variationData}
				modelRelations={this.props.relations.authorPublication.filter(hasRegularName("isCreatedBy"))}
				onNavigate={this.props.onNavigate}
				relations={this.props.relations} />) : null;

		let variationReceptionsComponent = this.props.variationData ? (
			<RelationList
				model={this.props.variationData}
				modelRelations={this.props.relations.authorPublication.filter(hasRegularName("isCreatedBy", true))}
				onNavigate={this.props.onNavigate}
				relations={this.props.relations} />) : null;

		let variationLinksComponent = this.props.variationData ? <Links values={this.props.variationData} /> : null;


		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<div className="record-container">
						<div className="variations">{variationSelect}{variationBasicComponent}</div>
						<BasicInfo author={this.props.author} onNavigate={this.props.onNavigate} />
					</div>
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
					<div className="record-container">
						<div className="variations">{variationSelect}{variationPersonalComponent}</div>
						<Personal author={this.props.author} onNavigate={this.props.onNavigate} />
					</div>
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
					<div className="record-container">
						<div className="variations">{variationSelect}{variationPublicComponent}</div>
						<Public author={this.props.author} onNavigate={this.props.onNavigate} />
					</div>
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
					<div className="record-container">
						<div className="variations">{variationSelect}{variationPublicationsComponent}</div>
						<RelationList
							model={this.props.author}
							modelRelations={this.props.relations.authorPublication.filter(hasRegularName("isCreatedBy"))}
							onNavigate={this.props.onNavigate}
							relations={this.props.relations} />
					</div>
				</Tab>

				<Tab
					active={this.props.tab === "receptions"}
					label="Receptions">
					<div className="record-container">
						<div className="variations">{variationSelect}{variationReceptionsComponent}</div>
						<RelationList
							model={this.props.author}
							modelRelations={this.props.relations.authorPublication.filter(hasRegularName("isCreatedBy", true))}
							onNavigate={this.props.onNavigate}
							relations={this.props.relations} />
					</div>
				</Tab>

				<Tab
					active={this.props.tab === "links"}
					label="Links">
					<div className="record-container">
						<div className="variations">{variationSelect}{variationLinksComponent}</div>
						<Links values={this.props.author.links} />
					</div>
				</Tab>
			</Tabs>
		);
	}
}

AuthorRecord.propTypes = {
	author: React.PropTypes.object,
	id: React.PropTypes.string,
	onNavigate: React.PropTypes.func,
	onSelectVariation: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	relations: React.PropTypes.object,
	showVariation: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "personal", "public", "publications", "receptions", "links"]),
	variationData: React.PropTypes.object
};

export default AuthorRecord;