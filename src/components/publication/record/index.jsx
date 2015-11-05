import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import RelationList from "../../relation-list";
import Links from "../../links";
import VariationSelect from "../../values/variation-select";

class PublicationRecord extends React.Component {
	render() {
		let variationSelect = (<VariationSelect
				onSelectVariation={this.props.onSelectVariation}
				showVariation={this.props.showVariation}
				variationRefs={this.props.publication["@variationRefs"]}
			/>);

		let variationBasicComponent = this.props.variationData ?
			<BasicInfo onNavigate={this.props.onNavigate} value={this.props.variationData} /> :
			null;

		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<div className="variations">{variationSelect}{variationBasicComponent}</div>
					<BasicInfo
						onNavigate={this.props.onNavigate}
						value={this.props.publication} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Creator</label>
								<span>{this.props.publication.tempCreator}</span>
							</li>
							<li>
								<label>Language</label>
								<span>{this.props.publication.tempLanguage}</span>
							</li>
							<li>
								<label>Origin</label>
								<span>{this.props.publication.tempOrigin}</span>
							</li>
						</ul>
					</div>
				</Tab>
				<Tab
					active={this.props.tab === "receptions"}
					label="Receptions">
					<RelationList
						model={this.props.publication}
						modelRelations={this.props.relations.publicationPublication}
						onNavigate={this.props.onNavigate}
						relations={this.props.relations} />
				</Tab>
				<Tab
					active={this.props.tab === "links"}
					label="Links">
					<Links values={this.props.publication.links} />
				</Tab>
			</Tabs>
		);
	}
}

PublicationRecord.propTypes = {
	id: React.PropTypes.string,
	onNavigate: React.PropTypes.func,
	onSelectVariation: React.PropTypes.func,	
	onTabChange: React.PropTypes.func,
	publication: React.PropTypes.object,
	relations: React.PropTypes.object,
	showVariation: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"]),
	variationData: React.PropTypes.object
};

PublicationRecord.defaultProps = {
	tab: "basic info"
};

export default PublicationRecord;