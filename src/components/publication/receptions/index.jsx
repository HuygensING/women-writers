import React from "react";

import actions from "../../../actions/relations";
import relationsStore from "../../../stores/relations";
import DocumentRelation from "../../values/relation-document";

let toObject = (prev, current) => {
	prev[current.regularName] = current;
	prev[current.inverseName] = current;

	return prev;
};

class Receptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			publicationPublicationRelations: [],
			relationDisplayNames: {}
		};
	}
	componentDidMount() {
		actions.getRelations();
		relationsStore.listen(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {
		relationsStore.stopListening(this.onStoreChange.bind(this));
	}

	onStoreChange() {
		this.setState(relationsStore.getState());
	}

	notEmpty(model) {
		return (relationName) =>
			model.get("@relations").get(relationName).size > 0;
	}

	toJSX(model) {
		return function(relationName) {
			let label = this.state.relationDisplayNames[relationName] !== "" ?
				this.state.relationDisplayNames[relationName] :
				relationName;

			return (
				<li key={relationName}>
					<label>{label}</label>
					<DocumentRelation values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);
		};
	}

	render() {
		let model = this.props.value;

		let relations = this.state.publicationPublicationRelations.reduce(toObject, {});

		let notEmpty = this.notEmpty(model);
		let toJSX = this.toJSX(model).bind(this);
		let relationViews = Object.keys(relations).filter(notEmpty).map(toJSX);

		let record = relationViews.length > 0 ?
			<ul className="record">{relationViews}</ul> :
			<div className="hire-empty-list">The list of receptions is empty.</div>;

		return record;
	}
}

export default Receptions;