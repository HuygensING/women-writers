import React from "react";
import Input from "hire-forms-input";
import Autocomplete from "hire-forms-autocomplete";

import {validateDate} from "../../../../validation";


class FirstPublisherForm extends React.Component {

	onChange(field, value) {
		let newValues = [];
		newValues[0] = (this.props.values || [])[0] || {};
		newValues[0].relationId = null;

		if(field === "date") {
			newValues[0].date = value;
		} else if(field === "collective") {
			newValues[0].key = value.key;
			newValues[0].value = value.value;
		}
		this.props.onChange(newValues);
	}

	render() {
		let model = this.props.values && this.props.values.length ?
			{date: this.props.values[0].date, keyValueMap: {key: this.props.values[0].key, value: this.props.values[0].value}} :
			{date: "", keyValueMap: {}};

		return (<span>
			<label>Date</label>
			<Input onChange={this.onChange.bind(this, "date")} validate={validateDate} value={model.date} /><br />
			<label>Publisher</label>
			<Autocomplete async={this.props.async} onChange={this.onChange.bind(this, "collective")} value={model.keyValueMap} />

		</span>);
	}
}

FirstPublisherForm.propTypes = {
	async: React.PropTypes.func,
	onChange: React.PropTypes.func,
	values: React.PropTypes.array
};

export default FirstPublisherForm;

