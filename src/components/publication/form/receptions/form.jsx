import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Autocomplete from "hire-forms-autocomplete";
import API from "../../../../stores/api";

const DEFAULT_STATE = {
	relationType: {
		key: "",
		value: ""
	},
	relation: {
		key: "",
		value: ""
	}
};

class ReceptionForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = DEFAULT_STATE;
	}
	handleChange(key, value) {
		this.setState({
			[key]: value
		});
	}

	handleSubmit() {
		this.setState(DEFAULT_STATE);

		this.props.onChange(this.state);
	}

	render() {
		let button = (this.state.relation.key !== "" && this.state.relationType.key !== "") ?
			<li>
				<button onClick={this.handleSubmit.bind(this)}>
					Add relation
				</button>
			</li> :
			null;

		return (
			<ul className="well">
				<li>
					<Select
						onChange={this.handleChange.bind(this, "relationType")}
						options={this.props.selectOptions}
						value={this.state.relationType} />
				</li>
				<li>
					<Autocomplete
						async={API.getDocuments}
						onChange={this.handleChange.bind(this, "relation")}
						value={this.state.relation} />
				</li>
				{button}
			</ul>
		);
	}
}

ReceptionForm.propTypes = {
	onChange: React.PropTypes.func,
	selectOptions: React.PropTypes.array
};

export default form(ReceptionForm);