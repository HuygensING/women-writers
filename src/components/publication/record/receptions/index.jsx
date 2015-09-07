import React from "react";

// import actions from "../../../../actions/relations";
// import relationsStore from "../../../../stores/relations";
import DocumentRelation from "../../../values/relation-document";

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
		<DocumentRelation values={model["@relations"][relationName]} />
	</li>;

class Receptions extends React.Component {
	render() {
		let relations = this.props.relations.publicationPublication.reduce(toObject, {});
		let relationList = Object.keys(relations)
			.filter(hasRelation(this.props.publication))
			.map(toJSX(this.props.publication, this.props.relations.displayNames));

		let record = relationList.length > 0 ?
			<ul className="record">
				{relationList}
			</ul> :
			<div className="hire-empty-list">The list of receptions is empty.</div>;

		return record;
	}
}

export default Receptions;