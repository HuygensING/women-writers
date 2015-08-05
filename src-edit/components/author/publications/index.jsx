import React from "react";

import actions from "../../../actions/relations";
import relationsStore from "../../../stores/relations";
import DocumentRelation from "../../values/relation-document";

let hasSourceType = function(type) {
	return (prev, current) => {
		let name = (current.sourceTypeName === type) ?
			current.regularName :
			current.inverseName;

		prev[name] = current;

		return prev;
	};
};

class Publications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			authorPublicationRelations: [],
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

		let relations = this.state.authorPublicationRelations.reduce(hasSourceType("person"), {});
		let relationViews = Object.keys(relations).map((relationName) =>
			<li>
				<label>{this.state.relationDisplayNames[relationName]}</label>
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

export default Publications;