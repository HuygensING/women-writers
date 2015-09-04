// TODO Remove relations
// TODO Add new relation to main model

import React from "react";
import form from "hire-forms-form";

import PublicationForm from "./form";

import actions from "../../../../actions/relations";
import relationsStore from "../../../../stores/relations";

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

		this.onStoreChange = this.onStoreChange.bind(this);

		this.state = {
			authorPublicationRelations: [],
			relationDisplayNames: {}
		};
	}

	componentDidMount() {
		actions.getRelations();
		relationsStore.listen(this.onStoreChange);
	}

	componentWillUnmount() {
		relationsStore.stopListening(this.onStoreChange);
	}

	onStoreChange() {
		this.setState(relationsStore.getState());
	}

	handleFormChange(formData) {
		let currentRelations = this.props.value.getIn(["@relations", formData.relationType.key]).toJS();

		this.props.onChange(["@relations", formData.relationType.key], [...currentRelations, formData.relation]);
	}

	render() {
		let model = this.props.value;

		let relationNames = this.state.authorPublicationRelations
			.map((relation) =>
				relation.sourceTypeName === "person" ? relation.regularName : relation.inverseName
			);


		let relations = relationNames
			.filter((relationName) =>
				model.getIn(["@relations", relationName]).size > 0
			)
			.map((relationName) =>
				<li key={relationName}>
					<label>{this.state.relationDisplayNames[relationName]}</label>
					<RelationDocument values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		return (
			<div>
				<PublicationForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={relationNames.map(toKeyValue(this.state.relationDisplayNames))}
					value={this.state.regularForm} />
				<ul className="record">
					{relations}
				</ul>
			</div>
		);
	}
}

export default form(ReceptionsForm);