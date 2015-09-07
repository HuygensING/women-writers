import React from "react";
import {Tabs, Tab} from "hire-tabs";

import BasicInfo from "./basic-info";
import Receptions from "./receptions";
import Links from "../../links";

class PublicationRecord extends React.Component {
	render() {
		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<BasicInfo
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
					<Receptions
						relations={this.props.relations}
						publication={this.props.publication}/>
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
	tab: React.PropTypes.oneOf(["basic info", "links", "receptions"])
};

PublicationRecord.defaultProps = {
	tab: "basic info"
};

export default PublicationRecord;