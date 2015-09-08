// TODO NewButton should have a select first, to choose
// what kind of author. The select should only be visible if the the
// parent is saved (has an _id prop).

import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import ReceptionsForm from "./receptions";
import LinkForm from "../../edit-link";

class PublicationForm extends React.Component {
	render() {
		let model = this.props.publication;

		let receptions = (model._id != null) ?
			<Tab
				active={this.props.tab === "receptions"}
				label="Receptions">
				<ReceptionsForm
					onChange={this.props.onFormChange}
					onDelete={this.props.onFormDelete}
					publication={model} />
			</Tab> :
			null;

		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<BasicInfoForm
						onChange={this.props.onFormChange}
						onDelete={this.props.onFormDelete}
						publication={model} />
					<div className="temp-data">
						<h2>Temporary data</h2>
						<ul>
							<li>
								<label>Creator</label>
								<span>{model.tempCreator}</span>
							</li>
							<li>
								<label>Language</label>
								<span>{model.tempLanguage}</span>
							</li>
							<li>
								<label>Origin</label>
								<span>{model.tempOrigin}</span>
							</li>
						</ul>
					</div>
				</Tab>
				{receptions}
				<Tab
					active={this.props.tab === "links"}
					label="Links">
					<MultiForm
						attr={"links"}
						component={LinkForm}
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

PublicationForm.propTypes = {
	id: React.PropTypes.string,
	tab: React.PropTypes.oneOf(["basic info", "receptions", "links"])
};

export default PublicationForm;