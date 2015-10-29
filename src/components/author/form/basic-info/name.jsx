import React from "react";
import form from "hire-forms-form";
import Input from "hire-forms-input";

const placeholders = {
	FORENAME: "First name",
	SURNAME: "Last name",
	NAME_LINK: "Infix"
};

class NameForm {

	render() {
		let components = this.props.value.components;
		let inputs = components.length ?
			components.map((component, i) => (
				<li key={i}>
					<Input
						onChange={this.props.handleChange.bind(this, ["components", i, component.type])}
						placeholder={placeholders[component.type]}
						value={component.value} />
				</li>
			)) :
			["FORENAME", "SURNAME"].map((type, i) => (
				<li key={i}>
					<Input
						onChange={this.props.handleChange.bind(this, type)}
						placeholder={placeholders[type]}
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