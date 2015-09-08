import React from "react";

import DocumentRelation from "../values/relation-document";

let toObject = (prev, current) => {
	prev[current.regularName] = current;
	prev[current.inverseName] = current;

	return prev;
};

let hasRelation = model => relationName =>
	model["@relations"].hasOwnProperty(relationName);

let toJSX = (model, displayNames) => relationName =>
	<li key={relationName}>
		<label>{displayNames[relationName]}</label>
		<DocumentRelation
			onNavigate={this.props.onNavigate}
			values={model["@relations"][relationName]} />
	</li>;

class RelationList extends React.Component {
	render() {
		let relations = this.props.modelRelations.reduce(toObject, {});
		let relationList = Object.keys(relations)
			.filter(hasRelation(this.props.model))
			.map(toJSX(this.props.model, this.props.relations.displayNames));

		let record = relationList.length > 0 ?
			<ul className="record">
				{relationList}
			</ul> :
			<div className="hire-empty-list">The list is empty.</div>;

		return record;
	}
}

RelationList.propTypes = {
	model: React.PropTypes.object,
	modelRelations: React.PropTypes.array,
	relations: React.PropTypes.object
};

export default RelationList;