import React from "react";
import form from "hire-forms-form";

import RelationList from "../../../relation-list";
import PublicationForm from "./form";

let toKeyValue = function(displayNames) {
	return (relationName) => {
		return {
			key: relationName,
			value: displayNames[relationName]
		};
	};
};

class AuthorPublicationsController extends React.Component {
	handleFormChange(formData) {
		let currentRelations = this.props.author["@relations"][formData.relationType.key];

		if (currentRelations == null) {
			currentRelations = [];
		}

		this.props.onChange(["@relations", formData.relationType.key], [...currentRelations, formData.relation]);
	}

	render() {
		let relationNames = this.props.relations.authorPublication
			.map((relation) =>
				relation.sourceTypeName === "person" ? relation.regularName : relation.inverseName
			);

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
					onNavigate={this.props.onNavigate}
					relations={this.props.relations} />
			</div>
		);
	}
}

export default form(AuthorPublicationsController);