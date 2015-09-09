import React from "react";

import DocumentRelation from "../values/relation-document";

let toObject = (prev, current) => {
	prev[current.regularName] = current;
	prev[current.inverseName] = current;

	return prev;
};

let hasRelation = model => relationName =>
	model["@relations"].hasOwnProperty(relationName);

let toJSX = (model, displayNames, navigate) => relationName =>
	<li key={relationName}>
		<label>{displayNames[relationName]}</label>
		<DocumentRelation
			onNavigate={navigate}
			values={model["@relations"][relationName]} />
	</li>;

class RelationList extends React.Component {
	render() {
		let relations = this.props.modelRelations.reduce(toObject, {});
		let relationList = Object.keys(relations)
			.filter(hasRelation(this.props.model))
			.map(toJSX(
				this.props.model,
				this.props.relations.displayNames,
				this.props.onNavigate
			));

		return relationList.length > 0 ?
			<ul className="record">
				{relationList}
			</ul> :
			<div className="hire-empty-list">The list is empty.</div>;
	}
}

RelationList.propTypes = {
	model: React.PropTypes.object,
	modelRelations: React.PropTypes.array,
	onNavigate: React.PropTypes.func.isRequired,
	relations: React.PropTypes.object
};

RelationList.defaultProps = {
	modelRelations: []
};

export default RelationList;