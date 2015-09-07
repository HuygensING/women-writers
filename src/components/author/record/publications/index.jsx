import React from "react";

import DocumentRelation from "../../../values/relation-document";

let hasSourceType = function(type) {
	return (prev, current) => {
		let name = (current.sourceTypeName === type) ?
			current.regularName :
			current.inverseName;

		prev[name] = current;

		return prev;
	};
};

let hasRelation = model => relationName =>
	model["@relations"].hasOwnProperty(relationName);

let toJSX = (model, displayNames) => relationName =>
	<li key={relationName}>
		<label>{displayNames[relationName]}</label>
		<DocumentRelation values={model["@relations"][relationName]} />
	</li>;


class Publications extends React.Component {
	render() {
		let relations = this.props.relations.authorPublication.reduce(hasSourceType("person"), {});
		let relationViews = Object.keys(relations)
			.filter(hasRelation(this.props.author))
			.map(toJSX(this.props.author, this.props.relations.displayNames));

		return (
			<ul className="record">
				{relationViews}
			</ul>
		);
	}
}

export default Publications;