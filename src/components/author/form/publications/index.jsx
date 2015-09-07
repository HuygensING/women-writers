// TODO Remove relations
// TODO Add new relation to main model

import React from "react";
import form from "hire-forms-form";

import RelationList from "../../../relation-list";
import PublicationForm from "./form";

import RelationDocument from "../../../values/relation-document";

let toKeyValue = function(displayNames) {
	return (relationName) => {
		return {
			key: relationName,
			value: displayNames[relationName]
		};
	};
};

class PublicationsForm extends React.Component {
	handleFormChange(formData) {
		let currentRelations = this.props.value["@relations"][formData.relationType.key];

		this.props.onChange(["@relations", formData.relationType.key], [...currentRelations, formData.relation]);
	}

	render() {
		// let model = this.props.value;

		let relationNames = this.props.relations.authorPublication
			.map((relation) =>
				relation.sourceTypeName === "person" ? relation.regularName : relation.inverseName
			);


		// let relations = relationNames
		// 	.filter((relationName) =>
		// 		model["@relations"][relationName].length > 0
		// 	)
		// 	.map((relationName) =>
		// 		<li key={relationName}>
		// 			<label>{this.state.relationDisplayNames[relationName]}</label>
		// 			<RelationDocument values={model["@relations"][relationName]} />
		// 		</li>
		// 	);

		let selectOptions = relationNames
			.map(toKeyValue(this.props.relations.displayNames))

		return (
			<div>
				<PublicationForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={selectOptions} />
				<RelationList
					model={this.props.author}
					modelRelations={this.props.relations.authorPublication}
					relations={this.props.relations} />
			</div>
		);
	}
}

export default form(PublicationsForm);