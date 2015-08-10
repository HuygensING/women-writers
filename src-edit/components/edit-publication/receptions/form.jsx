import React from "react";
import form from "hire-forms-form";
import Select from "hire-forms-select";
import Autocomplete from "hire-forms-autocomplete";
import API from "../../../stores/api";

class ReceptionForm extends React.Component {
	render() {
		return (
			<ul>
				<li>
					<Select
						onChange={this.props.onChange.bind(this, "relationType")}
						options={this.props.selectOptions}
						value={this.props.value.relationType} />
				</li>
				<li>
					<Autocomplete
						async={API.getDocuments}
						onChange={this.props.onChange.bind(this, "relation")}
						value={this.props.value.relation} />
				</li>
			</ul>
		);
	}
}

export default form(ReceptionForm);