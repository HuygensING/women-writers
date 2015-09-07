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

class ReceptionsForm extends React.Component {
	constructor(props) {
		super(props);

		// this.onStoreChange = this.onStoreChange.bind(this);

		this.state = {
			publicationPublicationRelations: [],
			relationDisplayNames: {}
		};
	}

	// componentDidMount() {
	// 	actions.getRelations();
	// 	relationsStore.listen(this.onStoreChange);
	// }

	// componentWillUnmount() {
	// 	relationsStore.stopListening(this.onStoreChange);
	// }

	// onStoreChange() {
	// 	this.setState(relationsStore.getState());
	// }

	handleFormChange(formData) {
		let currentRelations = this.props.value.getIn(["@relations", formData.relationType.key]).toJS();

		this.props.onChange(["@relations", formData.relationType.key], [...currentRelations, formData.relation]);
	}

	render() {
		let model = this.props.value;

		let regularRelationNames = this.state.publicationPublicationRelations
			.map((relation) => relation.regularName);

		let inverseRelationNames = this.state.publicationPublicationRelations
			.map((relation) => relation.inverseName);

		let regularRelations = regularRelationNames
			.filter((relationName) =>
				model.getIn(["@relations", relationName]).size > 0
			)
			.map((relationName) =>
				<li key={relationName}>
					<label>{this.state.relationDisplayNames[relationName]}</label>
					<RelationDocument values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		regularRelations = regularRelations.length ?
			<ul className="record">{regularRelations}</ul> :
			null;

		let inverseRelations = inverseRelationNames
			.filter((relationName) =>
				model.getIn(["@relations", relationName]).size > 0
			)
			.map((relationName) =>
				<li key={relationName}>
					<label>{this.state.relationDisplayNames[relationName]}</label>
					<RelationDocument values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		inverseRelations = inverseRelations.length ?
			<ul className="record">{inverseRelations}</ul> :
			null;


		return (
			<div>
				<h3>Has</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={regularRelationNames.map(toKeyValue(this.state.relationDisplayNames))}
					value={this.state.regularForm} />
				{regularRelations}
				<h3>Is</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={inverseRelationNames.map(toKeyValue(this.state.relationDisplayNames))}
					value={this.state.inverseForm} />
				{inverseRelations}
			</div>
		);
	}
}

export default form(ReceptionsForm);