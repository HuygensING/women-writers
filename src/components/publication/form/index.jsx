// TODO NewButton should have a select first, to choose
// what kind of author. The select should only be visible if the the
// parent is saved (has an _id prop).

import React from "react";
import {Tabs, Tab} from "hire-tabs";

import MultiForm from "hire-forms-multi-form";

import BasicInfoForm from "./basic-info";
import ReceptionsForm from "./receptions";
import LinkForm from "../../edit-link";

import BasicInfo from "../record/basic-info";
import RelationList from "../../relation-list";
import Links from "../../links";
import VariationSelect from "../../values/variation-select";

class PublicationForm extends React.Component {
	render() {
		let model = this.props.publication;
		let variationSelect = (<VariationSelect
				onSelectVariation={this.props.onSelectVariation}
				showVariation={this.props.showVariation}
				variationRefs={this.props.publication["@variationRefs"]}
			/>);

		let variationBasicComponent = this.props.variationData ?
			<BasicInfo onNavigate={this.props.onNavigate} value={this.props.variationData} /> :
			null;

		let variationReceptionsComponent = this.props.variationData ?
			<RelationList
				model={this.props.variationData}
				modelRelations={this.props.relations.publicationPublication}
				onNavigate={this.props.onNavigate}
				relations={this.props.relations} /> : null;

		let variationLinksComponent = this.props.variationData ? <Links values={this.props.variationData} /> : null;



		let receptions = (model._id != null) ?
			<Tab
				active={this.props.tab === "receptions"}
				label="Receptions">
				<div className="record-container">
					<div className="variations">{variationSelect}{variationReceptionsComponent}</div>
					<ReceptionsForm
						onChange={this.props.onFormChange}
						onDelete={this.props.onFormDelete}
						onNavigate={this.props.onNavigate}
						publication={model}
						relations={this.props.relations} />
				</div>
			</Tab> :
			null;

		let links = (model._id != null) ?
			<Tab
				active={this.props.tab === "links"}
				label="Links">
				<div className="record-container">
					<div className="variations">{variationSelect}{variationLinksComponent}</div>
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
				</div>
			</Tab> :
			null;

		return (
			<Tabs onChange={this.props.onTabChange}>
				<Tab
					active={this.props.tab === "basic info"}
					label="Basic info">
					<div className="record-container">
						<div className="variations">{variationSelect}{variationBasicComponent}</div>
						<BasicInfoForm
							onChange={this.props.onFormChange}
							onDelete={this.props.onFormDelete}
							publication={model} />
					</div>
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
				{links}
			</Tabs>
		);
	}
}

PublicationForm.propTypes = {
	id: React.PropTypes.string,
	onFormChange: React.PropTypes.func,
	onFormDelete: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	onTabChange: React.PropTypes.func,
	publication: React.PropTypes.object,
	relations: React.PropTypes.object,
	tab: React.PropTypes.oneOf(["basic info", "receptions", "links"])
};

export default PublicationForm;