// TODO Remove relations
// TODO Add new relation to main model

import React from "react";
import form from "hire-forms-form";

import ReceptionForm from "./form";

import actions from "../../../actions/relations";
import relationsStore from "../../../stores/relations";

import Relation from "../../values/relation";

class ReceptionsForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			publicationPublicationRelations: [],
			relationDisplayNames: {},
			inverseForm: {
				relationType: "",
				relation: ""
			},
			regularForm: {
				relationType: "",
				relation: ""
			}
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

	handleFormChange(formName, prop, value) {
		let oldState = this.state[formName];
		oldState[prop] = value;

		this.setState({
			[formName]: oldState
		});
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
					displayNames={this.state.relationDisplayNames}
					onChange={this.handleFormChange.bind(this, "regularForm")}
					selectOptions={regularRelationNames.map((n) => this.state.relationDisplayNames[n])}
					value={this.state.regularForm} />
				<ul>
					{regularRelations}
				</ul>
				<h3>Is</h3>
				<ReceptionForm
					displayNames={this.state.relationDisplayNames}
					onChange={this.handleFormChange.bind(this, "inverseForm")}
					selectOptions={inverseRelationNames.map((n) => this.state.relationDisplayNames[n])}
					value={this.state.inverseForm} />
				<ul>
					{inverseRelations}
				</ul>
			</div>
		);
	}
}

export default form(ReceptionsForm);