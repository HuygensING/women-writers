// TODO Remove relations
// TODO Add new relation to main model

import React from "react";
import form from "hire-forms-form";

import ReceptionForm from "./form";

// import actions from "../../../../actions/relations";
// import relationsStore from "../../../../stores/relations";

import RelationDocument from "../../../values/relation-document";

let toKeyValue = function(displayNames) {
	return (relationName) => {
		return {
			key: relationName,
			value: displayNames[relationName]
		};
	};
};

let modelHasRelation = model => relationName =>
	model["@relations"].hasOwnProperty(relationName) && model["@relations"][relationName].length > 0;

let toJSX = (model, displayNames, onNavigate, onRemove) => relationName =>
	<li key={relationName}>
		<label>{displayNames[relationName]}</label>
		<RelationDocument
			onNavigate={onNavigate}
			onRemove={onRemove}
			relationName={relationName}
			values={model["@relations"][relationName]} />
	</li>;

class ReceptionsForm extends React.Component {
	handleFormChange(formData) {
		let currentRelations = this.props.publication["@relations"][formData.relationType.key] || [];

		this.props.onChange(
			["@relations", formData.relationType.key],
			[...currentRelations, formData.relation]
		);
	}

	handleRemove(relationName, id) {
		// Remove the relation from the current array of ["@relations"][relationName].
		let updatedRelations = this.props.publication["@relations"][relationName]
			.filter((relation) =>
				relation.key !== id
			);

		this.props.onChange(
			["@relations", relationName],
			updatedRelations
		);
	}

	render() {
		let model = this.props.publication;

		let regularRelationNames = this.props.relations.publicationPublication
			.map((relation) => relation.regularName);

		let inverseRelationNames = this.props.relations.publicationPublication
			.map((relation) => relation.inverseName);

		let regularRelations = regularRelationNames
			.filter(modelHasRelation(model))
			.map(toJSX(model, this.props.relations.displayNames, this.props.onNavigate, this.handleRemove.bind(this)));

		regularRelations = regularRelations.length ?
			<ul className="record">{regularRelations}</ul> :
			null;

		let inverseRelations = inverseRelationNames
			.filter(modelHasRelation(model))
			.map(toJSX(model, this.props.relations.displayNames, this.props.onNavigate, this.handleRemove.bind(this)));

		inverseRelations = inverseRelations.length ?
			<ul className="record">{inverseRelations}</ul> :
			null;


		return (
			<div>
				<h3>Has</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={regularRelationNames.map(toKeyValue(this.props.relations.displayNames))}
					value={this.props.relations.regularForm} />
				{regularRelations}
				<h3>Is</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={inverseRelationNames.map(toKeyValue(this.props.relations.displayNames))}
					value={this.props.relations.inverseForm} />
				{inverseRelations}
			</div>
		);
	}
}

ReceptionsForm.propTypes = {
	author: React.PropTypes.object,
	onChange: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	publication: React.PropTypes.object,
	relations: React.PropTypes.object
};

export default form(ReceptionsForm);