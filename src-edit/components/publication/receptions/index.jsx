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

	render() {
		let model = this.props.value;
		console.log(model.getIn(["@relations", "isTranslationOf"]).toJS());
		let relations = this.state.publicationPublicationRelations.reduce(toObject, {});
		// console.log(JSON.stringify(Object.keys(relations)));
		let relationViews = Object.keys(relations).map((relationName) =>
			<li>
				<label>{this.state.relationDisplayNames[relationName] !== "" ? this.state.relationDisplayNames[relationName] : relationName}</label>
				<DocumentRelation values={model.getIn(["@relations", relationName]).toJS()} />
			</li>
		);

		return (
			<ul className="record">
				{relationViews}
			</ul>
		);
	}
}

export default Receptions;