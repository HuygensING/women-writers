import React from "react";
import RelationList from "../../values/relation-list";
import RelationField from "../../form-fields/relation";

class Publications extends React.Component {
	render() {
		const publications = (this.props.entity.data["@relations"].isCreatorOf || [])
			.sort((a, b) => a.displayName.localeCompare(b.displayName));

		const { editable, onChange, metadata } = this.props;

		return (
			<ul className="list-group">{ editable ?
				(
					<li className="list-group-item">
						<label>Author of</label>
						<RelationField name="isCreatorOf"
							path={metadata.properties.find((p) => p.name === "isCreatorOf").quicksearch}
							onChange={onChange} entity={this.props.entity} />
					</li>
				) : publications.length === 0 ?
					<li className="list-group-item">The list is empty</li>
				: <RelationList label="Author of" relations={publications} linkTo="publicationIndex" />
			}</ul>
		);
	}
}

export default Publications;