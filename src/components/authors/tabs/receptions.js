import authorReceptionDefinitions from "../../../definitions/author-receptions";
import React from "react";
import RelationList from "../../values/relation-list";
import RelationField from "../../form-fields/relation";

class Receptions extends React.Component {

	render() {

		const listIsEmpty = authorReceptionDefinitions.outBound
			.map((receptionType) => (this.props.entity.data["@relations"][receptionType] || []))
			.filter((receptions) => receptions.length > 0)
			.length === 0;

		const { editable, onChange, metadata } = this.props;

		if (editable) {
			return (
				<ul className="list-group">
					{authorReceptionDefinitions.outBound.map((receptionType, i) => (
						<li className="list-group-item" key={i}>
							<label>{authorReceptionDefinitions.overviewLabels[receptionType]}</label>
							<RelationField name={receptionType}
								path={metadata.properties.find((p) => p.name === receptionType).quicksearch}
								onChange={onChange} entity={this.props.entity}
							/>
						</li>
					))}
				</ul>
			);
		} else {
			return listIsEmpty ? (
				<ul className="list-group">
					<li className="list-group-item">The list is empty</li>
				</ul>
			) : (
				<ul className="list-group">
					{authorReceptionDefinitions.outBound.map((receptionType, j) => {
						const receptions = (this.props.entity.data["@relations"][receptionType] || [])
							.sort((a, b) => a.displayName.localeCompare(b.displayName));
						return receptions.length ? (
							<RelationList
								key={j}
								label={authorReceptionDefinitions.overviewLabels[receptionType]}
								relations={receptions}
								linkTo="publicationIndex"
							/>
						) : null;
					})}
				</ul>
			);
		}
	}
}


export default Receptions;