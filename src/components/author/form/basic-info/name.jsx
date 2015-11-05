import React from "react";
import form from "hire-forms-form";
import Input from "hire-forms-input";
/*
<option value="SURNAME">SURNAME</option>
<option value="FORENAME">FORENAME</option>
<option value="ROLE_NAME">ROLE_NAME</option>
<option value="ADD_NAME">ADD_NAME</option>
<option value="NAME_LINK">NAME_LINK</option>
<option value="GEN_NAME">GEN_NAME</option>
*/
class NameForm extends React.Component {

	render() {
		let components = this.props.value.components;
		let inputs = components.length ?
			components.map((component, i) => (
				<li key={i}>
					<div>
						<button className="hire-remove-form" onClick={this.props.handleChange.bind(this, ["components", i, "REMOVE"])}>✕</button>
						{component.type}
					</div>
					<Input
						onChange={this.props.handleChange.bind(this, ["components", i, component.type])}
						placeholder={component.type}
						value={component.value} />
				</li>
			)) :
			["FORENAME", "NAME_LINK", "SURNAME"].map((type, i) => (
				<li key={i}>
					<Input
						onChange={this.props.handleChange.bind(this, type)}
						placeholder={type}
						value={this.props.value[type]} />
				</li>
			));

		return (<ul>{inputs}</ul>);
	}
}

NameForm.propTypes = {
	handleChange: React.PropTypes.func,
	value: React.PropTypes.object
};

export default form(NameForm, "names-form");