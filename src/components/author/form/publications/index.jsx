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

		this.props.onChange(
			["@relations", formData.relationType.key],
			[...currentRelations, formData.relation]
		);
	}

	handleRemove(relationName, id) {
		this.props.onChange(
			["@relations", relationName],
			this.props.author["@relations"][relationName].filter((relation) =>
				relation.key !== id
			)
		);
	}

	render() {
		let relationNames = this.props.relations.authorPublication
			.map((relation) =>
				relation.sourceTypeName === "person" ? relation.regularName : relation.inverseName
			);

		let selectOptions = relationNames
			.map(toKeyValue(this.props.relations.displayNames));

		return (
			<div>
				<PublicationForm
					onChange={this.handleFormChange.bind(this)}
					selectOptions={selectOptions} />
				<RelationList
					model={this.props.author}
					modelRelations={this.props.relations.authorPublication}
					onNavigate={this.props.onNavigate}
					onRemove={this.handleRemove.bind(this)}
					relations={this.props.relations} />
			</div>
		);
	}
}

AuthorPublicationsController.propTypes = {
	author: React.PropTypes.object,
	onChange: React.PropTypes.func,
	onNavigate: React.PropTypes.func,
	relations: React.PropTypes.object
};

export default form(AuthorPublicationsController);