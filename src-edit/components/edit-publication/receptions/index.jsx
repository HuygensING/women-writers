import React from "react";
import form from "hire-forms-form";
import AutocompleteList from "hire-forms-autocomplete-list";

import actions from "../../../actions/relations";
import relationsStore from "../../../stores/relations";

import API from "../../../stores/api";

let pluckRegularAndInverseNames = (prev, current) => {
	prev.push(current.regularName);
	prev.push(current.inverseName);

	return prev;
};


class ReceptionsForm extends React.Component {
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

		let relations = this.state.publicationPublicationRelations
			.reduce(pluckRegularAndInverseNames, [])
			.map((relationName) =>
				<li key={relationName}>
					<label>{this.state.relationDisplayNames[relationName]}</label>
					<AutocompleteList
						async={API.getDocuments}
						onChange={this.props.onChange.bind(this, ["@relations", relationName])}
						values={model.getIn(["@relations", relationName]).toJS()} />
				</li>
			);

		return (
			<ul>
				{relations}
			</ul>
		);
	}
}

export default form(ReceptionsForm);