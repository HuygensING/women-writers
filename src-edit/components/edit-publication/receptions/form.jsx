import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Autocomplete from "hire-forms-autocomplete";
import API from "../../../stores/api";

class ReceptionForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			relationType: {
				key: "",
				value: ""
			},
			relation: {
				key: "",
				value: ""
			}
		};
	}
	handleChange(key, value) {
		this.setState({
			[key]: value
		});
	}

	render() {
		let active = (this.state.relationType.key !== "" && this.state.relation.key !== "");

		return (
			<ul>
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
				<li>
					<button onClick={this.props.onChange.bind(this, this.state)}>Add relation</button>
				</li>
			</ul>
		);
	}
}

export default form(ReceptionForm);