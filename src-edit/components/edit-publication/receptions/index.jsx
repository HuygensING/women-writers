// TODO Remove relations
// TODO Add new relation to main model

import React from "react";
import form from "hire-forms-form";

import ReceptionForm from "./form";

import actions from "../../../actions/relations";
import relationsStore from "../../../stores/relations";

import Relation from "../../values/relation";

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

		this.state = {
			publicationPublicationRelations: [],
			relationDisplayNames: {}
		};
	}

	componentDidMount() {
		actions.getRelations();
		relationsStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		relationsStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(relationsStore.getState());
	}

	handleFormChange(formData) {
		console.log(formData.relation.key);
		console.log(this.props.value.getIn(["@relations", formData.relationType.key]).toJS());
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
					<Relation values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		let inverseRelations = inverseRelationNames
			.filter((relationName) =>
				model.getIn(["@relations", relationName]).size > 0
			)
			.map((relationName) =>
				<li key={relationName}>
					<label>{this.state.relationDisplayNames[relationName]}</label>
					<Relation values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		return (
			<div>
				<h3>Has</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={regularRelationNames.map(toKeyValue(this.state.relationDisplayNames))}
					value={this.state.regularForm} />
				<ul>
					{regularRelations}
				</ul>
				<h3>Is</h3>
				<ReceptionForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={inverseRelationNames.map(toKeyValue(this.state.relationDisplayNames))}
					value={this.state.inverseForm} />
				<ul>
					{inverseRelations}
				</ul>
			</div>
		);
	}
}

export default form(ReceptionsForm);